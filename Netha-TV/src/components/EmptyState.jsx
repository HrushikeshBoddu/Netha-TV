import { Link } from 'react-router-dom';

const EmptyState = ({ message, actionText, actionLink }) => {
  return (
    <div className="empty-state">
      <div className="empty-content">
        <h3>{message}</h3>
        <Link to={actionLink} className="btn">
          {actionText}
        </Link>
      </div>
    </div>
  );
};

export default EmptyState;