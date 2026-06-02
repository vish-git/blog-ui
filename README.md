# Blog UI

A lightweight React frontend for the Real‑Time Blog API. Provides user registration/login, post creation and browsing, and live comment updates via Socket.IO. Built with Vite, Axios, React Router, and socket.io-client.

---

## Features

- Authentication (register / login) with JWT stored in localStorage
- Posts: list, view, and create posts with tags and author metadata
- Comments: add and view comments on a post; comments update in real time for all viewers
- Realtime: per‑post Socket.IO rooms (`joinPost` / `leavePost`) and `newComment` events
- Optimistic UI with client‑side deduplication to avoid duplicate comments
- Simple, modular codebase for quick extension and testing

---

## Quick Start

### Prerequisites
- Node.js v16+
- Backend Real‑Time Blog API running (default: http://localhost:5000)

---

## Install

```bash
git clone <repo-url> blog-ui
cd blog-ui
npm install
```

---

## Environment

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:5000
```

Restart dev server after changes.

---

## Run (Development)

```bash
npm run dev
```

Open: http://localhost:5173

---

## Build (Production)

```bash
npm run build
npm run preview
```

---

## Project Structure

```
src/
├─ api.js
├─ AuthContext.jsx
├─ main.jsx
├─ App.jsx
├─ pages/
│  ├─ Register.jsx
│  ├─ Login.jsx
│  ├─ Posts.jsx
│  └─ PostDetail.jsx
├─ components/
│  ├─ PostForm.jsx
│  ├─ PostList.jsx
│  ├─ CommentForm.jsx
│  └─ CommentList.jsx
└─ index.css
```

---

## How It Works

### Auth Flow
- Register/Login returns `{ user, token }`
- Token stored in `localStorage`
- Axios attaches token via `Authorization` header

### Posts
- `GET /posts` → list posts
- `POST /posts` → create post (auth required)

### Comments + Realtime
- `GET /comments/:postId`
- `POST /comments/:postId`
- Socket.IO:
  - join room: `joinPost`
  - event: `newComment`
- Client deduplicates comments by `_id`

---

## Common Commands

```bash
npm run dev
npm run build
npm run preview
```

---

## Troubleshooting

### No comment form
- Ensure user is logged in
- Check token in localStorage

### Socket issues
- Verify `VITE_API_URL`
- Check backend CORS settings
- Inspect WS frames in DevTools

### Duplicate comments
- Ensure only one socket listener per post
- Prevent multiple submits

### CORS errors
Allow frontend origin:
```
http://localhost:5173
```

---

## Testing Checklist

- Register user
- Login and verify token
- Create post
- Open same post in 2 tabs
- Add comment → verify realtime sync

---

## Extending

- Add validation (Zod / Yup)
- UI library (Tailwind / MUI)
- Pagination
- Tests (Vitest / RTL)
- Offline support

---

## Contributing

- Fork repo
- Create feature branch
- Submit PR with tests
