import React from 'react';

export default function CommentList({ comments }) {
  if (!comments.length) return <div>No comments yet</div>;
  return (
    <div>
      {comments.map(c => (
        <div key={c._id} style={{borderTop:'1px solid #f1f5f9',padding:'8px 0'}}>
          <div style={{color:'#666',fontSize:13}}>{c.userId?.username || 'user'} • {new Date(c.createdAt).toLocaleString()}</div>
          <div>{c.comment}</div>
        </div>
      ))}
    </div>
  );
}
