import { api } from "../utils/axios"

export const login=async(token)=>{
    try {
        const {data}=await api.post("/api/auth/login",{token})
        return data
    } catch (error) {
        console.log(error);
        return null
    }
}

export const logout=async()=>{
    try {
        const {data}=await api.get("/api/auth/logout")
        return data
    } catch (error) {
        console.log(error);
        return null
    }
}