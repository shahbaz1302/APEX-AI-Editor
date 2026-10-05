import { Router } from "express";
import { createProject, deleteProject, getProjects, getProjectWithId, getStarredProjects, toggleStar } from "../controllers/project.controller.js";

const router=Router()

router.post("/",createProject)
router.get("/",getProjects)
router.get("/starred",getStarredProjects)
router.get("/:id",getProjectWithId)
router.patch("/:id",toggleStar)
router.delete("/:id",deleteProject)

export default router