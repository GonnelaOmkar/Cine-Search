import React, { useEffect, useState } from 'react';
import { getTrending } from '../services/tmdb';
import MovieCard from '../components/MovieCard';
import { TrendingUp } from 'lucide-react';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setLoading(true);
        const data = await getTrending();
        setMovies(data.results || []);
      } catch (err) {
        setError('Failed to fetch trending movies. Please ensure your API key is configured correctly.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  if (loading) {
    return (
      <div className="container loading-state">
        <div className="spinner"></div>
        <p>Loading trending movies...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container error-state">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="heading-2 section-title">
        <TrendingUp style={{ color: 'var(--accent)' }} />
        Trending This Week
      </h1>
      
      {movies.length === 0 ? (
        <div className="empty-state">
          <p>No trending movies found.</p>
        </div>
      ) : (
        <div className="movie-grid">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
