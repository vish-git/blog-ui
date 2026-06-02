// src/components/CommentForm.jsx
import React, { useState } from 'react';
import api from '../api';

export default function CommentForm({ postId, onAdd }) {
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setError('');
    setLoading(true);

    try {
      const res = await api.post(`/comments/${postId}`, { comment: trimmed });
      // optimistic add; server will also emit newComment — dedupe prevents duplicates
      if (res?.data) onAdd(res.data);
      setText('');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to post comment');
      console.error('Comment post error', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Write a comment..."
        required
        rows="3"
        style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ddd' }}
      />
      <button type="submit" disabled={loading} style={{ background: '#2563eb', color: '#fff', padding: '8px 12px', borderRadius: 6, border: 'none', cursor: loading ? 'default' : 'pointer' }}>
        {loading ? 'Posting...' : 'Post Comment'}
      </button>
      {error && <div style={{ color: '#b91c1c' }}>{error}</div>}
    </form>
  );
}
