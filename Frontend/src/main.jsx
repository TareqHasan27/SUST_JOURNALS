import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import UserProfile from './pages/Profile/userProfile.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProfile></UserProfile>
  </StrictMode>
)
