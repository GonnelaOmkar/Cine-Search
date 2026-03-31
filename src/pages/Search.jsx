import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchMovies } from '../services/tmdb';
import MovieCard from '../components/MovieCard';
import { Search as SearchIcon } from 'lucide-react';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) return;
    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const results = await searchMovies(query);
        setMovies(results);
      } catch (err) {
        setError('Failed to fetch search results. Please check your API key.');
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  if (!query) {
    return (
      <div className="container empty-state">
        <SearchIcon size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
        <p>Enter a movie title to start searching.</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="heading-2 section-title">
        Search Results for "{query}"
      </h1>
      
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Searching...</p>
        </div>
      ) : error ? (
        <div className="error-state">
          <p>{error}</p>
        </div>
      ) : movies.length === 0 ? (
        <div className="empty-state">
          <p>No results found</p>
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

export default Search;
