import React, { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Start from './pages/Start'
import UserLogin from './pages/UserLogin'
import UserSignup from './pages/UserSignup'
import CaptainLogin from './pages/CaptainLogin'
import CaptainSignup from './pages/CaptainSignup'
import { UserDataContext } from './context/UserContext'

const App = () => {
  const ans = useContext(UserDataContext);
  console.log(ans.user);
  
  return (
    <div>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/home" element={<Home />} />
        <Route path="/users/login" element={<UserLogin />} />
        <Route path="/users/signup" element={<UserSignup />} />
        <Route path="/captains/login" element={<CaptainLogin />} />
        <Route path="/captains/signup" element={<CaptainSignup />} />
      </Routes>
    </div>
  )
}

export default App