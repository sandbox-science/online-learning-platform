import './style/App.css';

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import { HealthCheck } from './pages/HealthCheck';
import { CourseDashboard } from './pages/CourseDashboard'
import { Course } from './pages/Course'
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'
import { Account } from './pages/Account'
import { Content } from './pages/Content'

import ProtectedRoute from "./config/ProtectedRoutes"

export default function App() {

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='*' element={<NotFound />} />
        <Route path='/health' element={<HealthCheck />} />
        <Route path='/courses' element={<ProtectedRoute><CourseDashboard /></ProtectedRoute>} />
        <Route path="/courses/:courseID" element={<ProtectedRoute><Course /></ProtectedRoute>} />
        <Route path="/courses/:courseID/:contentID" element={<ProtectedRoute><Content /></ProtectedRoute>} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/account' element={<ProtectedRoute><Account /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}
