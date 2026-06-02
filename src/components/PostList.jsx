import React from 'react';
import { Link } from 'react-router-dom';

export default function PostList({ posts }) {
  if (!posts.length) return <div>No posts yet</div>;
  return (
    <div>
      {posts.map(p => (
        <div key={p._id} style={{background:'#fff',padding:12,borderRadius:8,marginBottom:12}}>
          <h3><Link to={`/posts/${p._id}`}>{p.title}</Link></h3>
          <div style={{color:'#666',fontSize:13}}>By {p.authorId?.username || 'unknown'} • {new Date(p.createdAt).toLocaleString()}</div>
          <p>{p.content?.slice(0, 200)}{p.content?.length > 200 ? '...' : ''}</p>
        </div>
      ))}
    </div>
  );
}
