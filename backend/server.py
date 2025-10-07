#!/usr/bin/env python3
import os
import hmac
import json
import time
import hashlib
from urllib.parse import parse_qsl, unquote
from secrets import token_hex
from typing import Tuple, Dict, Any

from flask import Flask, request, jsonify, abort
from flask_cors import CORS

# -----------------------------------------------------------------------------
# Config
# -----------------------------------------------------------------------------
TG_BOT_TOKEN = os.environ.get("TG_BOT_TOKEN", "PUT_YOUR_BOT_TOKEN_HERE")  # храните секрет только в env!
INITDATA_TTL = int(os.environ.get("INITDATA_TTL", "300"))  # секунды допустимой давности auth_date
PORT = int(os.environ.get("PORT", "8000"))

app = Flask(__name__)
# Разрешим CORS для путей /api/* — при необходимости ограничьте origins вашим доменом
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Простые "инмемори" состояния для демо
TOKENS: Dict[str, Dict[str, Any]] = {}  # token -> profile
USERS_BY_TGID: Dict[int, Dict[str, Any]] = {}  # tg_user_id -> profile
LOCKERS = [
    {"id": 101, "sex": "male", "busyBy": None},
    {"id": 102, "sex": "male", "busyBy": "Ivan"},
    {"id": 201, "sex": "female", "busyBy": None},
]


# -----------------------------------------------------------------------------
# Telegram initData validation
# https://docs.telegram-mini-apps.com/platform/init-data
# Алгоритм:
# 1) взять initDataRaw (строку запроса)
# 2) отделить hash, отсортировать остальные пары по ключу, собрать "key=value" через \n
# 3) secret_key = HMAC_SHA256("WebAppData", bot_token)
# 4) local_hash = HMAC_SHA256(secret_key, data_check_string).hex()
# 5) сравнить local_hash с hash; проверить auth_date по TTL
# -----------------------------------------------------------------------------
def validate_init_data(init_data_raw: str, bot_token: str, max_age_sec: int) -> Tuple[bool, Dict[str, Any], str]:
    try:
        # Парсим query string как список пар; не разрушаем порядок значений с '='
        pairs = list(parse_qsl(init_data_raw, keep_blank_values=True))
        # Выделяем hash и фильтруем его из набора данных
        hash_val = None
        data_pairs = []
        for k, v in pairs:
            if k == "hash":
                hash_val = v
            else:
                data_pairs.append((k, v))
        if not hash_val:
            return False, {}, "No hash"

        # Сортировка по ключу
        data_pairs.sort(key=lambda x: x[0])

        # Собираем data_check_string
        lines = []
        for k, v in data_pairs:
            # Важно: значения должны быть декодированы (см. кейсы с & в именах)
            lines.append(f"{k}={unquote(v)}")
        data_check_string = "\n".join(lines)

        # Шаг 3: секретный ключ
        secret_key = hmac.new("WebAppData".encode("utf-8"), bot_token.encode("utf-8"), hashlib.sha256).digest()
        # Шаг 4: локальный хэш
        local_hash = hmac.new(secret_key, data_check_string.encode("utf-8"), hashlib.sha256).hexdigest()

        if not hmac.compare_digest(local_hash, hash_val):
            return False, {}, "Bad signature"

        # Проверяем auth_date
        auth_date = None
        for k, v in data_pairs:
            if k == "auth_date":
                try:
                    auth_date = int(v)
                except Exception:
                    pass
                break
        if not auth_date:
            return False, {}, "No auth_date"
        now = int(time.time())
        if now - auth_date > max_age_sec:
            return False, {}, "Expired"

        # Достаём user JSON (если есть)
        user_json = None
        for k, v in data_pairs:
            if k == "user":
                try:
                    user_json = json.loads(unquote(v))
                except Exception:
                    user_json = None
                break

        return True, {"user": user_json}, ""
    except Exception as e:
        return False, {}, f"Validation error: {e}"


def require_bearer_token() -> Dict[str, Any]:
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        abort(401, description="Unauthorized")
    token = auth[7:]
    profile = TOKENS.get(token)
    if not profile:
        abort(401, description="Invalid token")
    return profile


# -----------------------------------------------------------------------------
# API
# -----------------------------------------------------------------------------
@app.post("/api/auth/tg")
def auth_tg():
    # initDataRaw можно передать в заголовке Authorization: tma <initDataRaw> или в body.initDataRaw
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("tma "):
        init_data_raw = auth_header[4:]
    else:
        payload = request.get_json(silent=True) or {}
        init_data_raw = payload.get("initDataRaw", "")

    if not init_data_raw:
        return jsonify({"error": "No initDataRaw"}), 400

    ok, data, msg = validate_init_data(init_data_raw, TG_BOT_TOKEN, INITDATA_TTL)
    if not ok:
        return jsonify({"error": msg}), 401

    tg_user = data.get("user") or {}
    tg_id = tg_user.get("id")
    if not tg_id:
        return jsonify({"error": "No tg user id"}), 400

    # Найти/создать профиль
    profile = USERS_BY_TGID.get(tg_id)
    if not profile:
        profile = {
            "id": tg_id,
            "name": tg_user.get("first_name"),
            "username": tg_user.get("username"),
            "sex": None,  # можно потом заполнить на фронте POST /api/register-from-tg
        }
        USERS_BY_TGID[tg_id] = profile

    # Выдать "токен" (для демо — случайная строка)
    app_token = token_hex(24)
    TOKENS[app_token] = profile

    return jsonify({"token": app_token, "profile": profile})


@app.get("/api/lockers")
def get_lockers():
    # Пример защищенного эндпоинта
    _profile = require_bearer_token()
    sex = request.args.get("sex")
    if sex:
        filtered = [l for l in LOCKERS if l["sex"] == sex]
        return jsonify(filtered)
    return jsonify(LOCKERS)


@app.post("/api/finish")
def finish_training():
    profile = require_bearer_token()
    name = profile.get("name")
    # Освободим все шкафчики, занятые этим пользователем по имени
    for l in LOCKERS:
        if l.get("busyBy") == name:
            l["busyBy"] = None
    return jsonify({"ok": True})


@app.post("/api/register-from-tg")
def register_from_tg():
    profile = require_bearer_token()
    payload = request.get_json(silent=True) or {}
    sex = payload.get("sex")
    if sex not in ("male", "female", None):
        return jsonify({"error": "Invalid sex"}), 400
    profile["sex"] = sex
    return jsonify({"ok": True, "profile": profile})


@app.get("/api/health")
def health():
    return jsonify({"ok": True})


# -----------------------------------------------------------------------------
# Entry
# -----------------------------------------------------------------------------
if __name__ == "__main__":
    # Для продакшна используйте WSGI/ASGI (gunicorn/uvicorn) за Nginx
    app.run(host="0.0.0.0", port=PORT, debug=True)
