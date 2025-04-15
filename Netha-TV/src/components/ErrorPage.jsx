import { useRouteError, Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

const ErrorPage = () => {
  const error = useRouteError();
  
  return (
    <div className="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
      <Link to="/" className="back-link">
        <FiArrowLeft /> Back to Home
      </Link>
    </div>
  );
};

export default ErrorPage;