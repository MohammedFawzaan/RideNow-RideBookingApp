import React, { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Start from './pages/Start'
import UserLogin from './pages/UserLogin'
import UserSignup from './pages/UserSignup'
import CaptainLogin from './pages/CaptainLogin'
import CaptainSignup from './pages/CaptainSignup'
import UserLogout from './pages/UserLogout'
import UserProtectedWrapper from './pages/UserProtectedWrapper'
import CaptainHome from './pages/CaptainHome'
import CaptainProtectedWrapper from './pages/CaptainProtectedWrapper'
import CaptainLogout from './pages/CaptainLogout'
import Riding from './components/Riding'
import CaptainRiding from './pages/CaptainRiding'
import { CaptainDataContext } from './context/CaptainContext'
import { UserDataContext } from './context/UserContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  const ans = useContext(UserDataContext);
  // console.log(ans.user);

  const ans1 = useContext(CaptainDataContext)
  // console.log(ans1.captain);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/home" element={
          <UserProtectedWrapper>
            <Home />
          </UserProtectedWrapper>
        } />
        <Route path='/captain-home' element={
          <CaptainProtectedWrapper>
            <CaptainHome />
          </CaptainProtectedWrapper>
        } />

        <Route path='/riding' element={<Riding />} />
        <Route path='/captain-riding' element={<CaptainRiding />} />

        <Route path="/users/login" element={<UserLogin />} />
        <Route path="/users/signup" element={<UserSignup />} />
        <Route path="/captains/login" element={<CaptainLogin />} />
        <Route path="/captains/signup" element={<CaptainSignup />} />

        <Route path='/users/logout' element={
          <UserProtectedWrapper>
            <UserLogout />
          </UserProtectedWrapper>
        } />

        <Route path='/captains/logout' element={
          <CaptainProtectedWrapper>
            <CaptainLogout />
          </CaptainProtectedWrapper>
        } />
      </Routes>

      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
        style={{
          width: 'auto',    
          minWidth: '220px',
          maxWidth: '300px'
        }}
      />

    </div>
  )
}

export default App