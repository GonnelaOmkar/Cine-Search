import axios from 'axios';

const API_KEY = "5e39a9c2";
const BASE_URL = 'http://www.omdbapi.com/';

const omdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    apikey: API_KEY,
  },
});

export const searchMovies = async (query) => {
  const response = await omdbApi.get('', {
    params: {
      s: query,
      type: 'movie'
    }
  });
  
  if (response.data.Response === 'True') {
    return response.data.Search.map(movie => ({
      id: movie.imdbID,
      title: movie.Title,
      poster_path: movie.Poster !== 'N/A' ? movie.Poster : null,
      release_date: movie.Year,
      vote_average: null
    }));
  }
  return [];
};

export const getTrending = async () => {
  try {
    // OMDb doesn't have a trending endpoint, so we search for a popular keyword like 'Batman'
    const response = await omdbApi.get('', {
      params: {
        s: 'batman',
        type: 'movie',
      }
    });

    let results = [];
    if (response.data.Response === 'True') {
      results = response.data.Search.map(movie => ({
        id: movie.imdbID,
        title: movie.Title,
        poster_path: movie.Poster !== 'N/A' ? movie.Poster : null,
        release_date: movie.Year,
        vote_average: null
      }));
    }
    return { results };
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    throw error;
  }
};

export const getMovieDetails = async (id) => {
  try {
    const response = await omdbApi.get('', {
      params: {
        i: id,
        plot: 'full'
      }
    });
    const data = response.data;
    
    if (data.Response === 'False') throw new Error(data.Error);
    
    return {
      id: data.imdbID,
      title: data.Title,
      tagline: data.Awards !== 'N/A' ? data.Awards : '',
      overview: data.Plot !== 'N/A' ? data.Plot : 'No synopsis available.',
      poster_path: data.Poster !== 'N/A' ? data.Poster : null,
      backdrop_path: null,
      vote_average: parseFloat(data.imdbRating) || 0,
      runtime: parseInt(data.Runtime) || 0,
      release_date: data.Released,
      genres: data.Genre ? data.Genre.split(', ').map((g, i) => ({ id: i, name: g })) : []
    };
  } catch (error) {
    console.error(`Error fetching movie details for id ${id}:`, error);
    throw error;
  }
};

export const getMovieCredits = async (id) => {
  try {
    const response = await omdbApi.get('', {
      params: {
        i: id
      }
    });
    const data = response.data;
    
    if (data.Response === 'False') throw new Error(data.Error);
    
    const actors = data.Actors && data.Actors !== 'N/A' 
      ? data.Actors.split(', ').map((actor, i) => ({
          id: i,
          name: actor,
          character: 'Role',
          profile_path: null
        })) 
      : [];
    
    return { cast: actors };
  } catch (error) {
    console.error(`Error fetching movie credits for id ${id}:`, error);
    throw error;
  }
};
