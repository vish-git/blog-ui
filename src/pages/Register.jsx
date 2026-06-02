import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/register', form);
      login(res.data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  return (
    <div style={{background:'#fff',padding:16,borderRadius:8}}>
      <h2>Register</h2>
      <form onSubmit={submit}>
        <input value={form.username} onChange={e => setForm({...form, username: e.target.value})} placeholder="Username" required />
        <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="Email" type="email" required />
        <input value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="Password" type="password" required />
        <button type="submit">Register</button>
        {error && <div style={{color:'red'}}>{error}</div>}
      </form>
    </div>
  );
}
