import './App.css';

import React, { useState, useEffect } from 'react';
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

import ProtectedRoute from "./config/ProtectedRoutes"

export default function App() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    fetch('http://localhost:4000/')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then((data) => {
        setMessage(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home ApiStatus={message} />} />
        <Route path='*' element={<NotFound />} />
        <Route path='/health' element={<HealthCheck />} />
        <Route path='/courses' element={<ProtectedRoute><CourseDashboard /></ProtectedRoute>} />
        <Route path="/courses/:courseID" element={<ProtectedRoute><Course /></ProtectedRoute>} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/account' element={<ProtectedRoute><Account /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}
