import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar"; //  Import the Navbar
import '../styles/posts.css'; 

export default function Posts() {
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  const [user, setUser] = useState(null); //  Add user state
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('title');
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostBody, setNewPostBody] = useState('');
  const [newCommentBody, setNewCommentBody] = useState('');
  const [editPostId, setEditPostId] = useState(null);
  const [editPostTitle, setEditPostTitle] = useState('');
  const [editPostBody, setEditPostBody] = useState('');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser) {
      navigate('/login');
      return;
    }

    setUser(storedUser);
    fetchPosts(storedUser.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
  if (!searchTerm.trim()) {
    setFilteredPosts(posts);
  } else {
    const filtered = posts.filter(post => {
      if (searchBy === 'title') {
        return post.title.toLowerCase().includes(searchTerm.toLowerCase());
      } else if (searchBy === 'id') {
        return post.id.toString().includes(searchTerm);
      }
      return true;
    });
    setFilteredPosts(filtered);
  }
}, [posts, searchTerm, searchBy]);


  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };



  async function fetchPosts(userId) {
    try {
      const url = `http://localhost:3000/posts?userId=${userId}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  }



  async function handleAddPost(e) {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostBody.trim()) {
      alert('Title and body are required');
      return;
    }
    const newPost = {
      userId: user?.id,
      title: newPostTitle,
      body: newPostBody,
    };
    try {
      const res = await fetch(`http://localhost:3000/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      });
      if (!res.ok) throw new Error('Failed to add post');
      const createdPost = await res.json();
      setPosts(prev => [...prev, createdPost]);
      setNewPostTitle('');
      setNewPostBody('');
    } catch (e) {
      alert(e.message);
    }
  }

  async function handleDeletePost(postId) {
    if (!window.confirm('Delete this post?')) return;
    try {
      const res = await fetch(`http://localhost:3000/posts/${postId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete post');
      setPosts(prev => prev.filter(p => p.id !== postId));
      if (selectedPost?.id === postId) {
        setSelectedPost(null);
        setComments([]);
      }
    } catch (e) {
      alert(e.message);
    }
  }

  function selectPost(post) {
    setSelectedPost(post);
    fetchComments(post.id);
    setEditPostId(null);
  }

  async function fetchComments(postId) {
    try {
      const res = await fetch(`http://localhost:3000/comments?postId=${postId}`);
      if (!res.ok) throw new Error('Failed to fetch comments');
      const data = await res.json();
      setComments(data);
    } catch (e) {
      alert(e.message);
    }
  }

  async function handleAddComment(e) {
    e.preventDefault();
    if (!newCommentBody.trim()) {
      alert('Comment cannot be empty');
      return;
    }
    if (!selectedPost) {
      alert('No post selected');
      return;
    }
    const comment = {
      postId: selectedPost.id,
      userId: user?.id,   
      name: user?.username || 'User',
      email: user?.email || 'user@example.com',
      body: newCommentBody,
    };
    try {
      const res = await fetch(`http://localhost:3000/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(comment),
      });
      if (!res.ok) throw new Error('Failed to add comment');
      const savedComment = await res.json();
      setComments(prev => [...prev, savedComment]);
      setNewCommentBody('');
    } catch (e) {
      alert(e.message);
    }
  }

  async function handleDeleteComment(commentId) {
    if (!window.confirm('Delete this comment?')) return;
    try {
      const res = await fetch(`http://localhost:3000/comments/${commentId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete comment');
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch (e) {
      alert(e.message);
    }
  }

  function startEditingPost(post) {
    setEditPostId(post.id);
    setEditPostTitle(post.title);
    setEditPostBody(post.body);
  }

  async function handleSaveEditPost(e) {
    e.preventDefault();
    if (!editPostTitle.trim() || !editPostBody.trim()) {
      alert('Title and body cannot be empty');
      return;
    }
    try {
      const res = await fetch(`http://localhost:3000/posts/${editPostId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          title: editPostTitle,
          body: editPostBody,
          id: editPostId,
        }),
      });
      if (!res.ok) throw new Error('Failed to update post');
      const updatedPost = await res.json();
      setPosts(prev => prev.map(p => (p.id === editPostId ? updatedPost : p)));
      setSelectedPost(updatedPost);
      setEditPostId(null);
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <div className="posts-container">
      <Navbar user={user} onLogout={handleLogout} /> 
        
      <h2>User Posts</h2>

      <div className="search-section">
        <select value={searchBy} onChange={e => setSearchBy(e.target.value)}>
          <option value="title">Search by Title</option>
          <option value="id">Search by ID</option>
        </select>
        <input
          type="text"
          placeholder={`Search posts by ${searchBy}`}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <ul className="posts-list">
        {filteredPosts.map(post => (
          <li
            key={post.id}
            className={selectedPost?.id === post.id ? 'selected' : ''}
            onClick={() => selectPost(post)}
          >
            <span>
              #{post.id} - {post.title}
            </span>
            <div>
              <button onClick={e => { e.stopPropagation(); startEditingPost(post); }}>Edit</button>
              <button
                onClick={e => { e.stopPropagation(); handleDeletePost(post.id); }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      <form onSubmit={handleAddPost}>
        <h3>Add New Post</h3>
        <input
          type="text"
          placeholder="Title"
          value={newPostTitle}
          onChange={e => setNewPostTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Body"
          value={newPostBody}
          onChange={e => setNewPostBody(e.target.value)}
          required
          rows={4}
        />
        <button type="submit">Add Post</button>
      </form>

      {editPostId && (
        <form onSubmit={handleSaveEditPost}>
          <h3>Edit Post #{editPostId}</h3>
          <input
            type="text"
            value={editPostTitle}
            onChange={e => setEditPostTitle(e.target.value)}
            required
          />
          <textarea
            value={editPostBody}
            onChange={e => setEditPostBody(e.target.value)}
            required
            rows={4}
          />
          <button type="submit">Save Changes</button>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => setEditPostId(null)}
          >
            Cancel
          </button>
        </form>
      )}

      {selectedPost && (
        <div className="selected-post-details">
          <h3>Post Details</h3>
          <h4>{selectedPost.title}</h4>
          <p>{selectedPost.body}</p>

          <h4>Comments</h4>
          <ul className="comments-list">
            {comments.map(comment => (
              <li key={comment.id}>
                <strong>{comment.name}:</strong> {comment.body}
                {/* Only show delete if comment belongs to logged-in user */}
                {comment.userId === user?.id && (
                  <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
                )}
              </li>
            ))}
          </ul>

          <form onSubmit={handleAddComment}>
            <textarea
              placeholder="Add a comment..."
              value={newCommentBody}
              onChange={e => setNewCommentBody(e.target.value)}
              rows={3}
              required
            />
            <button type="submit">Add Comment</button>
          </form>
        </div>
      )}
    </div>
  );
}
