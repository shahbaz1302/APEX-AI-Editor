import { api } from "../utils/axios"

export const createRootFolder=async({projectId,projectName})=>{
    try {
        const {data}=await api.post("/api/files/create-root-folder",{projectId,projectName})
        return data
    } catch (error) {
        console.log(error);
        return null
    }
}

export const createFolder=async({projectId,name,parentId})=>{
    try {
        const {data}=await api.post("/api/files/create-folder",{projectId,name,parentId})
        return data
    } catch (error) {
        console.log(error);
        return null
    }
}

export const createFile=async({projectId,name,parentId,content="",language="plaintext"})=>{
    try {
        const {data}=await api.post(`/api/files/create-file`,{projectId,name,parentId,content,language})
        return data
    } catch (error) {
        console.log(error);
        return null
    }
}

export const updateFile=async({name,content,id})=>{
    try {
        const payload={name}
        if(content!==undefined) payload.content=content
        const {data}=await api.post(`/api/files/update/${id}`,payload)
        return data
    } catch (error) {
        console.log(error);
        return null
    }
}

export const deleteFile=async(id)=>{
    try {
        const {data}=await api.delete(`/api/files/${id}`)
        return data
    } catch (error) {
        console.log(error);
        return null
    }
}

export const getFile=async(id)=>{
    try {
        const {data}=await api.get(`/api/files/${id}`)
        return data
    } catch (error) {
        console.log(error);
        return null
    }
}

export const getTree=async(projectId)=>{
    try {
        const {data}=await api.get(`/api/files/tree/${projectId}`)
        return data
    } catch (error) {
        console.log(error);
        return null
    }
}