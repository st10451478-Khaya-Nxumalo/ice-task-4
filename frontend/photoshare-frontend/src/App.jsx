import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router";
import Navbar from './components/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import './App.css'
import isLoggedIn from './utils/isLoggedIn';
import ProtectedRoute from './utils/ProtectedRoute';
import Profile from './components/users/Profile';
import Profiles from './components/users/Profiles';
import Gallery from './components/photos/Gallery';

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <div>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute isAuthenticated={isLoggedIn} />}>
            <Route path="/" element={<Gallery />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profiles" element={<Profiles />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
