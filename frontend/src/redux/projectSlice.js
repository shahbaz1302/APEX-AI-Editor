import { createSlice } from "@reduxjs/toolkit";

const projectSlice=createSlice({
    name:"project",
    initialState:{
        projects:[],
        currentProject:null
    },
    reducers:{
        setProjects:(state,action)=>{
            state.projects=action.payload
        },
        setCurrentProject:(state,action)=>{
            state.currentProject=action.payload
        },
        addNewProject:(state,action)=>{
            state.projects.unshift(action.payload)
        },
        updateProject:(state,action)=>{
            const updatedProject=action.payload
            const projectIndex=state.projects.findIndex(project=>project._id===updatedProject._id)
            if(projectIndex!==-1){
                state.projects[projectIndex]=updatedProject
            }
        },
        removeProject:(state,action)=>{
            state.projects=state.projects.filter(project=>project._id!==action.payload)
        }
    }
})

export const {setProjects,addNewProject,updateProject,removeProject,setCurrentProject}=projectSlice.actions

export default projectSlice.reducer