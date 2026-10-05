import redis from "../../../shared/redis/redis.js"
import projectModel from "../models/project.model.js"

export const createProject=async(req,res)=>{
    try {
        const userId=req.headers["x-user-id"]
        if(!userId){
            return res.status(401).json({message:"User id is required"})
        }

        const{name,description}=req.body

        const project=await projectModel.create({
            owner:userId,
            name,
            description,
        })

        const key=`projects-${userId}`
        await redis.del(key)

        return res.status(201).json(project)
    } catch (error) {
        return res.status(500).json({message:`Create project error ${error}`})
    }
}

export const getProjects=async(req,res)=>{
    try {
        const userId=req.headers["x-user-id"]
        if(!userId){
            return res.status(401).json({message:"User id is required"})
        }

        const key=`projects-${userId}`
        let result=await redis.get(key)
        if(result) return res.status(200).json(JSON.parse(result))

        const projects=await projectModel.find({
            owner:userId
        }).sort({updatedAt:-1})

        await redis.set(key,JSON.stringify(projects))
        return res.status(200).json(projects)
    } catch (error) {
        return res.status(500).json({message:`Get projects error ${error}`})
    }
}

export const getProjectWithId=async(req,res)=>{
    try {
        const{id}=req.params
        const project=await projectModel.findById(id)
        if(!project){
            return res.status(404).json({message:"Project not found"})
        }

        project.lastOpenedAt=new Date()
        await project.save()
        return res.status(200).json(project)
    } catch (error) {
        return res.status(500).json({message:`Get project by id error ${error}`})
    }
}

export const getStarredProjects=async(req,res)=>{
    try {
        const userId=req.headers["x-user-id"]
        if(!userId){
            return res.status(401).json({message:"User id is required"})
        }

        const key=`starred-projects-${userId}`
        let result=await redis.get(key)
        if(result) return res.status(200).json(JSON.parse(result))

        const projects=await projectModel.find({
            owner:userId,
            starred:true
        }).sort({updatedAt:-1})
        await redis.set(key,JSON.stringify(projects))
        return res.status(201).json(projects)
    } catch (error) {
        return res.status(500).json({message:`Get starred project error ${error}`})
    }
}

export const toggleStar=async(req,res)=>{
    try {
        const userId=req.headers["x-user-id"]
        if(!userId){
            return res.status(401).json({message:"User id is required"})
        }

        const{id}=req.params
        const project=await projectModel.findOne({_id:id,owner:userId})
        if(!project){
            return res.status(404).json({message:"Project not found"})
        }

        project.starred=!project.starred
        await project.save()

        await redis.del(`projects-${userId}`,`starred-projects-${userId}`)

        return res.status(200).json(project)
    } catch (error) {
        return res.status(500).json({message:`Toggle star error ${error}`})
    }
}

export const deleteProject=async(req,res)=>{
    try {
        const userId=req.headers["x-user-id"]
        if(!userId){
            return res.status(401).json({message:"User id is required"})
        }

        const{id}=req.params
        const project=await projectModel.findOne({_id:id,owner:userId})
        if(!project){
            return res.status(404).json({message:"Project not found"})
        }

        const filesServiceUrl=process.env.FILES_SERVICE_URL || "http://localhost:8003"
        const filesResponse=await fetch(
            `${filesServiceUrl.replace(/\/+$/,"")}/project/${encodeURIComponent(id)}`,
            {method:"DELETE",headers:{"x-user-id":String(userId)}}
        )
        if(!filesResponse.ok){
            console.error(`Project file cleanup failed with status ${filesResponse.status}`)
            return res.status(502).json({message:"Unable to delete project files. Please try again."})
        }

        const deletedProject=await projectModel.findOneAndDelete({_id:id,owner:userId})
        if(!deletedProject){
            return res.status(404).json({message:"Project not found"})
        }

        await redis.del(`projects-${userId}`,`starred-projects-${userId}`)

        return res.status(200).json(deletedProject)
    } catch (error) {
        return res.status(500).json({message:`Project delete error ${error}`})
    }
}