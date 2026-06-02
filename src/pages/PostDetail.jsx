// src/pages/PostDetail.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import CommentList from '../components/CommentList';
import CommentForm from '../components/CommentForm';
import { io } from 'socket.io-client';
import { useAuth } from '../AuthContext';

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const socketRef = useRef(null);
  const { user } = useAuth();

  // load post and comments once
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [pRes, cRes] = await Promise.all([
          api.get(`/posts/${id}`),
          api.get(`/comments/${id}`)
        ]);
        if (!mounted) return;
        setPost(pRes.data);
        setComments(Array.isArray(cRes.data) ? cRes.data : []);
      } catch (err) {
        console.error('Failed to load post or comments', err);
      }
    };
    load();
    return () => { mounted = false; };
  }, [id]);

  // socket: single connection per post, single listener, cleanup, dedupe
  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
      transports: ['websocket', 'polling']
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('socket connected', socket.id);
      socket.emit('joinPost', id);
    });

    const handleNewComment = (comment) => {
      if (!comment) return;
      setComments(prev => {
        // dedupe by _id when available
        if (comment._id) {
          return prev.some(c => c._id === comment._id) ? prev : [comment, ...prev];
        }
        // fallback dedupe by content+user+timestamp
        const exists = prev.some(c =>
          c.comment === comment.comment &&
          String(c.userId?._id || c.userId) === String(comment.userId?._id || comment.userId) &&
          new Date(c.createdAt).toISOString() === new Date(comment.createdAt).toISOString()
        );
        return exists ? prev : [comment, ...prev];
      });
    };

    socket.on('newComment', handleNewComment);

    socket.on('disconnect', (reason) => {
      console.log('socket disconnected', reason);
    });

    return () => {
      try { socket.emit('leavePost', id); } catch (e) { /* ignore */ }
      socket.off('newComment', handleNewComment);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [id]);

  // robust onAdd used by CommentForm (dedupe at call site)
  const onAdd = (comment) => {
    if (!comment) return;
    setComments(prev => (comment._id && prev.some(c => c._id === comment._id)) ? prev : [comment, ...prev]);
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div>
      <div style={{ background: '#fff', padding: 12, borderRadius: 8, marginBottom: 12 }}>
        <h2>{post.title}</h2>
        <div style={{ color: '#666', fontSize: 13 }}>By {post.authorId?.username || 'unknown'}</div>
        <p>{post.content}</p>
      </div>

      <div style={{ background: '#fff', padding: 12, borderRadius: 8 }}>
        <h3>Comments</h3>
        {user ? (
          <CommentForm postId={id} onAdd={onAdd} />
        ) : (
          <div style={{ marginBottom: 12 }}>Please login to comment</div>
        )}
        <CommentList comments={comments} />
      </div>
    </div>
  );
}
