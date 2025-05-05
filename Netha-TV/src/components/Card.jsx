import React from 'react';

const Card = ({ item, onClick }) => {
  const imageUrl = item?.banner_path
    ? `http://localhost:8000/${item.banner_path.replace(/\\/g, '/')}`
    : '/fallback.jpg'; // fallback if no banner_path at all

  return (
    <div
      className="card shadow-sm"
      onClick={() => onClick && onClick(item)}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <img
        src={imageUrl}
        alt={item.title || 'No title'}
        className="card-img-top"
        style={{ width: '100%', height: '200px', objectFit: 'cover', margin: '0', padding: '0', borderRadius: '0' }}
        onError={(e) => e.target.src = '/fallback.jpg'}
      />
      <div className="card-body" style={{ minHeight: '80px' }}>
        <h5
          className="card-title"
          style={{
            fontSize: '1rem',
            lineHeight: '1.3rem',
            height: '2.6rem', // 1.3rem x 2 lines
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            whiteSpace: 'normal',
          }}
        >
          {item.title}
        </h5>
        <p className="card-text text-muted" style={{ display: 'none' }}>
          {item.description}
        </p>
      </div>

    </div>
  );
};

export default Card;
