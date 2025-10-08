export const fetchIsItNewClient = () => {
    const isLogined = localStorage.getItem("isLogined")
    console.log(!isLogined)
    return !isLogined
}