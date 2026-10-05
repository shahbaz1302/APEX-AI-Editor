import { configureStore } from '@reduxjs/toolkit'
import userReducer from "./userSlice"
import projectReducer from "./projectSlice"

export const store = configureStore({
  reducer: {
    user:userReducer,
    project:projectReducer
  }
})