import React, { useState } from 'react';
import api from '../api';

export default function PostForm({ onCreate }) {
  const [form, setForm] = useState({ title: '', content: '', tags: '' });
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = { title: form.title, content: form.content, tags: form.tags ? form.tags.split(',').map(t => t.trim()) : [] };
      const res = await api.post('/posts', payload);
      onCreate(res.data);
      setForm({ title: '', content: '', tags: '' });
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  return (
    <div style={{background:'#fff',padding:12,borderRadius:8,marginBottom:12}}>
      <h3>Create Post</h3>
      <form onSubmit={submit}>
        <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Title" required />
        <textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} placeholder="Content" rows="4" />
        <input value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} placeholder="Tags comma separated" />
        <button type="submit">Create</button>
        {error && <div style={{color:'red'}}>{error}</div>}
      </form>
    </div>
  );
}
