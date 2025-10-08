export const fetchIsItNewClient = () => {
    const isLogined = localStorage.getItem("isLogined")
    console.log(!isLogined)
    // return !isLogined
    return false
}

export const pushClient = () => {
    localStorage.setItem("isLogined", "true")
}