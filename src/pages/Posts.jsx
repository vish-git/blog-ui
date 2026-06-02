import React, { useEffect, useState } from 'react';
import api from '../api';
import PostList from '../components/PostList';
import PostForm from '../components/PostForm';
import { useAuth } from '../AuthContext';

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const { user } = useAuth();

  const load = async () => {
    const res = await api.get('/posts');
    setPosts(res.data);
  };

  useEffect(() => { load(); }, []);

  const onCreate = (post) => setPosts(prev => [post, ...prev]);

  return (
    <div>
      <h1>Posts</h1>
      {user && <PostForm onCreate={onCreate} />}
      <PostList posts={posts} />
    </div>
  );
}
