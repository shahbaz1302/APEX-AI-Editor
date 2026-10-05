import { BrowserRouter, Route, Routes } from "react-router-dom"
import Dashboard from './pages/Dashboard'
import { useEffect } from "react"
import { me } from "./features/me"
import { useDispatch } from "react-redux"
import { setUserData } from "./redux/userSlice"
import ProjectPage from "./pages/ProjectPage"
import Plan from "./pages/Plan"

const App = () => {
  const dispatch=useDispatch()
  useEffect(()=>{
    const fetch=async()=>{
      const data=await me()
      dispatch(setUserData(data))
    }
    fetch()
  },[])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard/>} />
        <Route path="/project/:id" element={<ProjectPage/>} />
        <Route path="/plan" element={<Plan/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App