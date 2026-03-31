import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const MovieCard = ({ movie }) => {
  const [imageError, setImageError] = React.useState(false);

  const posterUrl = movie.poster_path
    ? `${IMAGE_BASE_URL}${movie.poster_path}`
    : null;

  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : 'Unknown';

  return (
    <Link to={`/movie/${movie.id}`} className="movie-card">
      {posterUrl && !imageError ? (
        <img
          src={posterUrl}
          alt={movie.title}
          loading="lazy"
          className="movie-card-poster"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="movie-card-poster-placeholder">
          <span className="placeholder-text">{movie.title}</span>
        </div>
      )}
      <div className="movie-card-content">
        <h3 className="movie-card-title" title={movie.title}>
          {movie.title}
        </h3>
        <div className="movie-card-meta">
          <span>{releaseYear}</span>
          <div className="movie-rating">
            <Star size={14} fill="currentColor" />
            <span>{movie.vote_average ? movie.vote_average.toFixed(1) : 'NR'}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
