import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Posts from './pages/Posts';
import PostDetail from './pages/PostDetail';
import { useAuth } from './AuthContext';

export default function App() {
  const { user, logout } = useAuth();

  return (
    <div>
      <header style={{display:'flex',justifyContent:'space-between',padding:12,background:'#fff',borderBottom:'1px solid #eee'}}>
        <Link to="/">RealTime Blog</Link>
        <nav>
          <Link to="/" style={{marginRight:12}}>Posts</Link>
          {user ? (
            <>
              <span style={{marginRight:12}}>Hi, {user.username}</span>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{marginRight:12}}>Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </header>

      <main style={{maxWidth:900,margin:'24px auto',padding:'0 16px'}}>
        <Routes>
          <Route path="/" element={<Posts />} />
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </div>
  );
}
