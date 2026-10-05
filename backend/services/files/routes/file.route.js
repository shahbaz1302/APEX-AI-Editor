import { Router } from "express"
import { createFile, createFolder, createRootFolder, deleteFile, deleteProjectFiles, getFile, getTree, updateFile } from "../controllers/file.controller.js"

const router=Router()

router.post("/create-root-folder",createRootFolder)
router.post("/create-folder",createFolder)
router.post("/create-file",createFile)
router.post("/update/:id",updateFile)
router.delete("/project/:projectId",deleteProjectFiles)
router.delete("/:id",deleteFile)
router.get("/:id",getFile)
router.get("/tree/:projectId",getTree)

export default router