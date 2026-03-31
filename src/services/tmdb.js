import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY ?? '1cdc514ad440959b4e7e379092c9de1e';
const BASE_URL = 'https://api.themoviedb.org/3';

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

export const searchMovies = async (query) => {
  const response = await axios.get('https://api.themoviedb.org/3/search/movie', {
    params: {
      api_key: import.meta.env.VITE_TMDB_API_KEY,
      query: query,
      language: 'en-US',
      page: 1
    }
  });
  return response.data.results;
};

export const getTrending = async () => {
  try {
    const response = await tmdbApi.get('/trending/movie/week');
    return response.data;
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    throw error;
  }
};

export const getMovieDetails = async (id) => {
  try {
    const response = await tmdbApi.get(`/movie/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching movie details for id ${id}:`, error);
    throw error;
  }
};

export const getMovieCredits = async (id) => {
  try {
    const response = await tmdbApi.get(`/movie/${id}/credits`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching movie credits for id ${id}:`, error);
    throw error;
  }
};
