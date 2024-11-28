import './App.css';

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

import { Home } from './components/pages/Home'
import { NotFound } from './components/pages/NotFound'
import { HealthCheck } from './components/pages/HealthCheck';
import { CourseDashboard } from './components/pages/CourseDashboard'
import { Course } from './components/pages/Course'
import { Login } from './components/pages/Login'
import { Signup } from './components/pages/Signup'
import { Account } from './components/pages/Account'
import { Content } from './components/pages/Content'
import { UpdateAccount } from './components/pages/UpdateAccount'; // Import the UpdateAccount component

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
        <Route path='/account/update' element={<ProtectedRoute><UpdateAccount /></ProtectedRoute>} /> {/* New route */}
      </Routes>
    </Router>
  );
}
