import React, { useState, useEffect } from 'react';
import { fetchPosts } from '../api';
import Card from '../components/Card'; // adjust path if needed

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    // Optionally handle click events on a post card
    console.log("Clicked post:", item);
  };

  if (loading) return <div className="text-center p-5">Loading posts...</div>;
  if (error) return <div className="text-center p-5 text-danger">Error: {error}</div>;

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-5">All Posts</h1>

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
    </div>
  );
};

export default Posts;
