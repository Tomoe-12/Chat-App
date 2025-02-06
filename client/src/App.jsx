import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Auth from './pages/auth'
import Profile from './pages/profile'
import Chat from './pages/chat'
import { useAppStore } from './store'
import { apiClient } from './lib/api-client'
import { GET_USER_INFO } from './utils/constants'

// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore()
  return userInfo ? children : <Navigate to='/auth' />
}

// eslint-disable-next-line react/prop-types
const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore()
  return userInfo ? <Navigate to='/chat' /> : children
}

const App = () => {
  const { userInfo, setUserInfo } = useAppStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUserData = async () => {
      try {
        const res = await apiClient.get(GET_USER_INFO, { withCredentials: true })
        setUserInfo(res.status === 200 && res.data.id ? res.data : undefined)
        console.log({ res })
      } catch (error) {
        setUserInfo(undefined)
      } finally {
        setLoading(false)
      }
    }

    if (!userInfo) {
      getUserData()
    } else {
      setLoading(false)
    }
  }, [userInfo, setUserInfo])

  if (loading) {
    return <div className="spinner">Loading...</div> // Add your custom loading spinner here
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<PrivateRoute><Chat /></PrivateRoute>} />
        <Route path="/auth" element={<AuthRoute><Auth /></AuthRoute>} />
        <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="*" element={userInfo ? <Navigate to="/profile" /> : <Navigate to='/auth' />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
