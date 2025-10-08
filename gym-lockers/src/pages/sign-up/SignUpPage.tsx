import { useEffect, useMemo, useState } from "react";

type SignUpForm = {
  lastName: string;
  firstName: string;
  middleName: string;
  gender: "M" | "W";
  agree: boolean;
};

type Props = {
  onSubmit: (payload: { userId: string; form: SignUpForm }) => Promise<void> | void;
};

export const SignUpPage = ({ onSubmit }: Props) => {
  const tg = useMemo(() => window.Telegram?.WebApp, []);
  const [userId, setUserId] = useState<string>("");
  const [form, setForm] = useState<SignUpForm>({
    lastName: "",
    firstName: "",
    middleName: "",
    gender: "",
    agree: false,
  });

  useEffect(() => {
    if (!tg) {
      alert("Открыто вне Telegram — запустите как Mini App.");
      return;
    }
    tg.ready();
    tg.expand();

    const idNum = tg.initDataUnsafe?.user?.id ?? null;
    const idStr = idNum != null ? String(idNum) : "";
    setUserId(idStr);

    if (!idStr) {
      tg.showAlert("ID недоступен. Открой через WebApp‑кнопку.");
    }
  }, [tg]);

  const canSubmit =
    Boolean(userId) &&
    form.firstName.trim().length > 0 &&
    form.lastName.trim().length > 0 &&
    (form.gender === "M" || form.gender === "W") &&
    form.agree;

  const handleChange =
    (field: keyof SignUpForm) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
      setForm((s) => ({ ...s, [field]: value }));
    };

  const handleSubmit = async () => {
    if (!tg) {
      alert("Открыто вне Telegram — запустите как Mini App.");
      return;
    }
    if (!canSubmit) {
      tg.showAlert("Заполните обязательные поля и согласие.");
      return;
    }
    await onSubmit({ userId, form });
    tg.showAlert("Заявка отправлена");
  };

  return (
    <div
      style={{
        fontFamily: "system-ui, Arial",
        padding: 16,
        color: "var(--tg-theme-text-color)",
        background: "var(--tg-theme-bg-color)",
        minHeight: "100vh",
      }}
    >
      <h1>Регистрация</h1>

      <input
        type="text"
        placeholder="Фамилия"
        value={form.lastName}
        onChange={handleChange("lastName")}
        style={{ display: "block", width: "100%", marginTop: 8 }}
      />
      <input
        type="text"
        placeholder="Имя"
        value={form.firstName}
        onChange={handleChange("firstName")}
        style={{ display: "block", width: "100%", marginTop: 8 }}
      />
      <input
        type="text"
        placeholder="Отчество"
        value={form.middleName}
        onChange={handleChange("middleName")}
        style={{ display: "block", width: "100%", marginTop: 8 }}
      />

      <div style={{ marginTop: 12 }}>Пол:</div>
      <label style={{ display: "block", marginTop: 4 }}>
        <input
          type="radio"
          name="gender"
          value="W"
          checked={form.gender === "W"}
          onChange={handleChange("gender")}
        />
        Женский
      </label>
      <label style={{ display: "block", marginTop: 4 }}>
        <input
          type="radio"
          name="gender"
          value="M"
          checked={form.gender === "M"}
          onChange={handleChange("gender")}
        />
        Мужской
      </label>

      <label style={{ display: "block", marginTop: 12 }}>
        <input
          type="checkbox"
          checked={form.agree}
          onChange={handleChange("agree")}
        />
        Согласен с обработкой персональных данных
      </label>

      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        style={{
          marginTop: 16,
          padding: "10px 16px",
          border: "none",
          borderRadius: 8,
          cursor: canSubmit ? "pointer" : "not-allowed",
          background: "var(--tg-theme-button-color)",
          color: "var(--tg-theme-button-text-color)",
          opacity: canSubmit ? 1 : 0.6,
        }}
      >
        Зарегистрироваться
      </button>
    </div>
  );
};
