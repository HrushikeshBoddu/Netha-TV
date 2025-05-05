import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000',  // Update base URL to match the new structure
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor for auth tokens
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Vlogs Endpoints
export const fetchVlogs = () => API.get('/vlogs/'); // GET /vlogs/
export const fetchNewVlogs = () => API.get('/vlogs/new'); // GET /vlogs/new
export const fetchAllVlogs = () => API.get('/vlogs/all'); // GET /vlogs/all
export const createVlog = (vlogData) => API.post('/vlogs/', vlogData); // POST /vlogs/
export const deleteNewVlog = (vlogId) => API.delete(`/vlogs/new/${vlogId}`); // DELETE /vlogs/new/{vlog_id}

// Posts Endpoints
export const fetchPosts = () => API.get('/posts/all'); // GET /posts/
export const createPost = (postData) => API.post('/posts/', postData); // POST /posts/

// Live Sessions Endpoints
export const fetchLiveSessions = () => API.get('/lives/all'); // GET /lives/
export const createLiveSession = (liveData) => API.post('/lives/', liveData); // POST /lives/

// History Endpoints
export const fetchHistory = () => API.get('/history/'); // GET /history/

// Events Endpoints
export const fetchEvents = () => API.get('/events/all'); // GET /events/
export const fetchEventById = (eventId) => API.get(`/events/${eventId}`); // GET /events/{event_id}
export const createEvent = (eventData) => API.post('/events/', eventData); // POST /events/

// Default Route (Home)
export const fetchHome = () => API.get('/'); // GET / for home

export default API;
