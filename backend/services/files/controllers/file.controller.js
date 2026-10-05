import filesModel from "../models/file.model.js"
import { buildTree } from "../utils/buildTree.js"

export const createRootFolder=async(req,res)=>{
    try {
        const{projectId,projectName}=req.body
        const userId=req.headers["x-user-id"]
        if(!projectId || !projectName){
            return res.status(400).json({message:"Project id and name is required"})
        }

        const existingRootFolder=await filesModel.findOne({
            projectId,
            parentId:null,
            isDeleted:false
        })

        if(existingRootFolder){
            return res.status(400).json({message:"Root folder already exists"})
        }

        const rootFolder=await filesModel.create({
            owner:userId,
            parentId:null,
            name:projectName,
            projectId,
            type:"folder"
        })

        return res.status(201).json(rootFolder)
    } catch (error) {
        return res.status(400).json({message:`Create root folder error ${error}`})
    }
}

export const createFolder=async(req,res)=>{
    try {
        const{projectId,name,parentId}=req.body
        const userId=req.headers["x-user-id"]
        if(!projectId || !name || !parentId){
            return res.status(400).json({message:"Project id, name and parent id is required"})
        }

        const exist=await filesModel.findOne({
            name,
            projectId,
            parentId,
            isDeleted:false
        })

        if(exist){
            return res.status(400).json({message:"Folder already exists"})
        }

        const folder=await filesModel.create({
            owner:userId,
            parentId,
            name,
            projectId,
            type:"folder"
        })

        return res.status(201).json(folder)
    } catch (error) {
        return res.status(400).json({message:`Create folder error ${error}`})
    }
}

export const createFile=async(req,res)=>{
    try {
        const{projectId,name,parentId,content="",language="plaintext"}=req.body
        const userId=req.headers["x-user-id"]
        if(!projectId || !name || !parentId){
            return res.status(400).json({message:"Project id, name and parent id is required"})
        }

        const exist=await filesModel.findOne({
            name,
            projectId,
            parentId,
            isDeleted:false
        })

        if(exist){
            return res.status(400).json({message:"File already exists"})
        }

        const extension=name.includes(".")?name.split(".").pop():""

        const file=await filesModel.create({
            owner:userId,
            parentId:parentId || null,
            name,
            projectId,
            type:"file",
            language,
            content,
            extension,
            size:content.length
        })

        return res.status(201).json(file)
    } catch (error) {
        return res.status(400).json({message:`Create file error ${error}`})
    }
}

export const updateFile=async(req,res)=>{
    try {
        const{name,content}=req.body
        const userId=req.headers["x-user-id"]

        const file=await filesModel.findOne({
            _id:req.params.id,
            owner:userId,
            isDeleted:false
        })

        if(!file){
            return res.status(404).json({message:"File or folder not found"})
        }

        if(name!==undefined){
            if(typeof name!=="string" || !name.trim()){
                return res.status(400).json({message:"A non-empty name is required"})
            }

            const normalizedName=name.trim()
            const duplicate=await filesModel.findOne({
                projectId:file.projectId,
                parentId:file.parentId,
                name:normalizedName,
                isDeleted:false,
                _id:{$ne:file._id}
            })

            if(duplicate){
                return res.status(409).json({message:"A file or folder with that name already exists"})
            }

            file.name=normalizedName
            if(file.type==="file"){
                file.extension=normalizedName.includes(".")?normalizedName.split(".").pop().toLowerCase():""
            }
        }

        if(content!==undefined){
            if(file.type!=="file" || typeof content!=="string"){
                return res.status(400).json({message:"Content can only be updated on files"})
            }
            file.content=content
            file.size=content.length
        }

        await file.save()

        return res.status(200).json(file)
    } catch (error) {
        return res.status(500).json({message:`Update file error ${error}`})
    }
}

export const deleteFile=async(req,res)=>{
    try {
        const userId=req.headers["x-user-id"]

        const file=await filesModel.findOne({
            _id:req.params.id,
            owner:userId
        })

        if(!file){
            return res.status(404).json({message:"File or folder not found"})
        }

        const idsToDelete=[file._id]
        let parentIds=[file._id]

        while(parentIds.length){
            const children=await filesModel.find({
                owner:userId,
                projectId:file.projectId,
                parentId:{$in:parentIds}
            }).select("_id")
            parentIds=children.map(child=>child._id)
            idsToDelete.push(...parentIds)
        }

        const result=await filesModel.deleteMany({
            _id:{$in:idsToDelete},
            owner:userId,
            projectId:file.projectId
        })

        return res.status(200).json({
            message:"File or folder deleted",
            deletedCount:result.deletedCount
        })
    } catch (error) {
        return res.status(500).json({message:`Delete file error ${error}`})
    }
}

export const deleteProjectFiles=async(req,res)=>{
    try {
        const userId=req.headers["x-user-id"]
        const{projectId}=req.params

        if(!userId){
            return res.status(401).json({message:"User id is required"})
        }

        const result=await filesModel.deleteMany({
            projectId,
            owner:userId
        })

        return res.status(200).json({
            message:"Project files and folders deleted",
            deletedCount:result.deletedCount
        })
    } catch (error) {
        return res.status(500).json({message:`Delete project files error ${error}`})
    }
}

export const getFile=async(req,res)=>{
   try {
        const userId=req.headers["x-user-id"]
    
        const file=await filesModel.findOne({
            _id:req.params.id,
            owner:userId,
            isDeleted:false
        })

        if(file){
            return res.status(400).json({message:"File not found"})
        }

        return res.status(201).json(file)
    } catch (error) {
        return res.status(400).json({message:`Get file error ${error}`})
    }
}

export const getTree=async(req,res)=>{
   try {
        const userId=req.headers["x-user-id"]
        const{projectId}=req.params
    
        const files=await filesModel.find({
            projectId,
            owner:userId,
            isDeleted:false
        }).sort({
            name:1,
            type:-1
        })

        const tree=buildTree(files)

        return res.status(201).json(tree)
    } catch (error) {
        return res.status(400).json({message:`Get tree error ${error}`})
    }
}