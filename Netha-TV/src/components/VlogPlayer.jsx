import { useEffect, useRef } from 'react';
import { FiX } from 'react-icons/fi';

const VlogPlayer = ({ vlog, onClose }) => {
  const videoRef = useRef(null);
  
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.focus();
    }
  }, []);

  return (
    <div className="vlog-player">
      {/* <button className="close-btn" onClick={onClose}>
        <FiX />
      </button> */}
      
      <div className="video-container">
        <iframe
          ref={videoRef}
          src={`https://www.youtube.com/embed/${extractVideoId(vlog.url)}?autoplay=1`}
          // title={vlog.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      
      {/* <div className="vlog-info">
        <h2>{vlog.title}</h2>
        <p className="views">{vlog.views?.toLocaleString()} views</p>
        <p className="description">{vlog.description}</p>
      </div> */}
    </div>
  );
};

// Helper function to extract YouTube video ID
function extractVideoId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export default VlogPlayer;