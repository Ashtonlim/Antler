import React from 'react'
import { Route, Routes } from 'react-router-dom'

import Home from './Home/Home'
import Register from './Register'
import Logout from './Logout'
import Login from './Login'
import Profile from './Profile/Profile'
import Portfolio from './Portfolio/Portfolio'
import Stock from './Stock/Stock'
import Watchlist from './Watchlist/Watchlist'

const Router = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/register" element={<Register />} />
    <Route path="/logout" element={<Logout />} />
    <Route path="/login" element={<Login />} />
    <Route path="/profile/:username" element={<Profile />} />
    <Route path="/portfolio" element={<Portfolio />} />
    <Route path="/stock/:ticker" element={<Stock />} />
    <Route path="/watchlist" element={<Watchlist />} />
  </Routes>
)

export default Router
