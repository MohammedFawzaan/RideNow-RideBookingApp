import React, { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Start from './pages/Start'
import UserLogin from './pages/UserLogin'
import UserSignup from './pages/UserSignup'
import CaptainLogin from './pages/CaptainLogin'
import CaptainSignup from './pages/CaptainSignup'
import UserLogout from './pages/UserLogout'
import CaptainLogout from './pages/CaptainLogout'
import GoogleSuccess from './pages/GoogleSuccess'
import UserProtectedWrapper from './pages/UserProtectedWrapper'
import CaptainHome from './pages/CaptainHome'
import CaptainProtectedWrapper from './pages/CaptainProtectedWrapper'
import Riding from './pages/Riding'
import Pickup from './pages/Pickup'
import CaptainRiding from './pages/CaptainRiding'
import CaptainPickup from './pages/CaptainPickup'
import { CaptainDataContext } from './context/CaptainContext'
import { UserDataContext } from './context/UserContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import NotFound from './pages/NotFound'
import NetworkStatus from './components/NetworkStatus'
import ErrorBoundary from './components/ErrorBoundary'

const App = () => {
  const ans = useContext(UserDataContext);
  const ans1 = useContext(CaptainDataContext);

  return (
    <div className='w-full h-screen'>
      <NetworkStatus />
      <ErrorBoundary>
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
          <Route path='/pickup' element={<Pickup />} />
          <Route path='/captain-riding' element={<CaptainRiding />} />
          <Route path='/captain-pickup' element={<CaptainPickup />} />

          <Route path="/users/login" element={<UserLogin />} />
          <Route path="/users/signup" element={<UserSignup />} />
          <Route path="/captains/login" element={<CaptainLogin />} />
          <Route path="/captains/signup" element={<CaptainSignup />} />
          <Route path="/google-success" element={<GoogleSuccess />} />

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
          <Route path='*' element={<NotFound />} />
        </Routes>
      </ErrorBoundary>

      <ToastContainer
        position="top-center"
        autoClose={500}
        hideProgressBar={true}
        closeOnClick
        limit={1}
        draggable
        theme="colored"
      />
    </div >
  )
}

export default App