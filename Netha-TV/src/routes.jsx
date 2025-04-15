import { createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import History from './pages/History';
import Events from './pages/Events';
import Vlogs from './pages/Vlogs';
import About from './pages/About';
import ErrorPage from './components/ErrorPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    errorElement: <ErrorPage />
  },
  {
    path: '/history',
    element: <History />,
    errorElement: <ErrorPage />
  },
  {
    path: '/events',
    element: <Events />,
    errorElement: <ErrorPage />
  },
  {
    path: '/vlogs',
    element: <Vlogs />,
    errorElement: <ErrorPage />
  },
  {
    path: '/about',
    element: <About />,
    errorElement: <ErrorPage />
  }
]);

export default router;