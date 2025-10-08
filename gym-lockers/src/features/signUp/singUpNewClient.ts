import axios from "axios";

export const fetchIsItNewClient = () => {
    const isLogined = localStorage.getItem("isLogined")
    console.log(!isLogined)
    return !isLogined
    // return false
}

export const pushClient = async ({firstName, middleName, lastName, telegramId, gender}: {
    firstName: string,
    middleName: string,
    lastName: string,
    telegramId: string,
    gender: string
}) => {
    const base = import.meta.env.VITE_API_SERVER_URL
    console.log("HERE BASE: ", base)

    const url = `${base}/api/register`; 
    const payload = {
        firstName,
        middleName,
        lastName,
        telegramId,
        gender,
    };

    const res = await axios.post(url, payload, {
        headers: {
            "Content-Type": "application/json",
        },
    });
    localStorage.setItem("isLogined", "true")

      return res.data;
}