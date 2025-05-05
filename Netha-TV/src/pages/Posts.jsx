import React, { useState, useEffect } from 'react';
import { fetchPosts } from '../api';
import Card from '../components/Card'; // adjust path if needed
import '../styles/Posts.css';
import Modal from '../components/Modal'; // ✅ Added modal import

// ✅ Helper to extract YouTube video ID
function extractVideoId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url?.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedPost, setSelectedPost] = useState(null); // ✅ For modal

  useEffect(() => {
    const getPosts = async () => {
      try {
        const response = await fetchPosts();
        const processedPosts = response.data.map(post => ({
          ...post,
          banner_path: post.banner_path || null,
          title: post.title || 'Untitled',
          description: post.content || '',
        }));
        setPosts(processedPosts);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    getPosts();
  }, []);

  const handleCardClick = (item) => {
    console.log("Clicked post:", item);
    setSelectedPost(item); // ✅ Trigger modal
  };

  if (loading) return <div className="text-center p-5">Loading posts...</div>;
  if (error) return <div className="text-center p-5 text-danger">Error: {error}</div>;

  return (
    <div id="posts" className="container mt-5">
      <h1 className="text-center mb-5" style={{ color: 'black' }}>All Posts</h1>

      {posts.length === 0 ? (
        <div className="text-center p-5">No posts available.</div>
      ) : (
        <div className="row">
          {posts.map(post => (
            <div key={post.id} className="col-md-4 mb-4">
              <Card item={post} onClick={handleCardClick} />
            </div>
          ))}
        </div>
      )}

      {/* ✅ Modal to show video */}
      <Modal
        isOpen={!!selectedPost}
        onClose={() => setSelectedPost(null)}
        size="xl"
        centered
      >
        {selectedPost?.url ? (
          <div className="p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 style={{ color: 'black' }}>{selectedPost.title}</h3>
              <button
                type="button"
                className="btn-close"
                onClick={() => setSelectedPost(null)}
                aria-label="Close"
              />
            </div>
            <div className="ratio ratio-16x9 mb-3">
              <iframe
                src={`https://www.youtube.com/embed/${extractVideoId(selectedPost.url)}?autoplay=1`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={selectedPost.title}
                style={{ borderRadius: '8px', width: '100%', height: '100%' }}
              ></iframe>
            </div>
          </div>
        ) : (
          <div className="p-4">
            <p>This post does not include a video.</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Posts;
