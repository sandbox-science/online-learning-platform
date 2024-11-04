import './App.css';

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

import { Home } from './components/pages/Home'
import { NotFound } from './components/pages/NotFound'
import { HealthCheck } from './components/pages/HealthCheck';
import { Courses } from './components/pages/Courses'
import { Login } from './components/pages/Login'
import { Signup } from './components/pages/Signup'
import { Account } from './components/pages/Account'

import ProtectedRoute from "./config/ProtectedRoutes"

export default function App() {

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='*' element={<NotFound />} />
        <Route path='/health' element={<HealthCheck />} />
        <Route path='/courses' element={<ProtectedRoute><Courses /></ProtectedRoute>} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/account' element={<ProtectedRoute><Account /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}
