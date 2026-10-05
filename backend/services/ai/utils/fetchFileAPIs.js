import axios from "axios"
import dotenv from "dotenv"
dotenv.config()

const fileUrl=process.env.FILE_SERVICE_URL

export const createFolder=async({projectId,name,parentId,userId})=>{
    try {
        const{data}=await axios.post(`${fileUrl}/create-folder`,{projectId,name,parentId},{headers:{
            "x-user-id":String(userId)
        }})
        return data
    } catch (error) {
        throw new Error(error)
    }
}

export const createFile=async({projectId,name,parentId,content="",language="plaintext",userId})=>{
    try {
        const{data}=await axios.post(`${fileUrl}/create-file`,{projectId,name,parentId,content,language},{headers:{
            "x-user-id":String(userId)
        }})
        return data
    } catch (error) {
        throw new Error(error)
    }
}

export const updateFile=async({name,content="",userId,id})=>{
    try {
        const{data}=await axios.post(`${fileUrl}/update/${id}`,{name,content},{headers:{
            "x-user-id":String(userId)
        }})
        return data
    } catch (error) {
        throw new Error(error)
    }
}

export const deleteFile=async({userId,id})=>{
    try {
        const{data}=await axios.delete(`${fileUrl}/${id}`,{headers:{
            "x-user-id":String(userId)
        }})
        return data
    } catch (error) {
        throw new Error(error)
    }
}

export const getTree=async({userId,projectId})=>{
    try {
        const{data}=await axios.get(`${fileUrl}/tree/${projectId}`,{headers:{
            "x-user-id":String(userId)
        }})
        return data
    } catch (error) {
        throw new Error(error)
    }
}

export const getFile=async({userId,id})=>{
    try {
        const{data}=await axios.get(`${fileUrl}/${id}`,{headers:{
            "x-user-id":String(userId)
        }})
        return data
    } catch (error) {
        throw new Error(error)
    }
}