import React from 'react';

const Card = ({ item, onClick }) => {
  const imageUrl = item?.banner_path
    ? `http://localhost:8000/${item.banner_path.replace(/\\/g, '/')}`
    : '/fallback.jpg'; // fallback if no banner_path at all

  return (
    <div 
      className="card h-100 shadow-sm" 
      onClick={() => onClick && onClick(item)} 
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <img 
        src={imageUrl}
        alt={item.title || 'No title'}
        className="card-img-top"
        style={{ height: '200px', objectFit: 'cover' }}
        onError={(e) => e.target.src = '/fallback.jpg'}
      />
      <div className="card-body">
        <h5 className="card-title">{item.title}</h5>
        <p className="card-text text-muted" style={{ fontSize: '0.9rem' }}>
          {item.description}
        </p>
      </div>
    </div>
  );
};

export default Card;
