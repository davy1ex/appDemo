import axios from "axios"

export const fetchOnScan = async () => {
    const API_BASE = import.meta.env.VITE_API_SERVER_URL;
    
    console.log(API_BASE)
    await axios.get(`${API_BASE}/api/toggle_lock`).then(res => console.log("RES", res)) // TODO link to server
    // TODO show lockers page
    
}