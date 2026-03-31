import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMovieDetails, getMovieCredits } from '../services/tmdb';
import { Star, Clock, Calendar, ArrowLeft } from 'lucide-react';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';
const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const PROFILE_BASE_URL = 'https://image.tmdb.org/t/p/w185';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        window.scrollTo(0, 0);
        const [detailsData, creditsData] = await Promise.all([
          getMovieDetails(id),
          getMovieCredits(id)
        ]);
        setMovie(detailsData);
        setCredits(creditsData);
      } catch (err) {
        setError('Failed to load movie details.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="container loading-state">
        <div className="spinner"></div>
        <p>Loading details...</p>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="container error-state">
        <p>{error || 'Movie not found.'}</p>
        <Link to="/" style={{ color: 'var(--accent)', marginTop: '1rem', textDecoration: 'none' }}>
          Return Home
        </Link>
      </div>
    );
  }

  const releaseYear = new Date(movie.release_date).getFullYear();
  const formatTime = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  const backdropUrl = movie.backdrop_path ? `${IMAGE_BASE_URL}${movie.backdrop_path}` : null;
  const posterUrl = movie.poster_path ? `${POSTER_BASE_URL}${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster';

  return (
    <>
      {backdropUrl && (
        <div 
          className="hero-backdrop" 
          style={{ backgroundImage: `url(${backdropUrl})` }}
        >
        </div>
      )}

      <div className="container">
        <div className="movie-details-grid" style={!backdropUrl ? { marginTop: '2rem' } : {}}>
          <div>
            <img src={posterUrl} alt={movie.title} className="movie-details-poster" />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', marginBottom: '0.5rem' }}>
                <ArrowLeft size={20} /> Back
              </Link>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 700, lineHeight: 1.1, margin: 0 }}>{movie.title}</h1>
              {movie.tagline && (
                <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.8)', fontStyle: 'italic', marginTop: '0.25rem' }}>
                  {movie.tagline}
                </p>
              )}
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Star style={{ color: '#fbbf24' }} size={20} />
                <span style={{ fontWeight: 600, color: '#fff' }}>
                  {movie.vote_average.toFixed(1)} 
                  <span style={{ fontSize: '0.875rem', fontWeight: 400, color: 'var(--text-secondary)' }}>/10</span>
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={20} />
                <span>{formatTime(movie.runtime)}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={20} />
                <span>{releaseYear}</span>
              </div>
            </div>

            <div className="genres-list" style={{ margin: 0 }}>
              {movie.genres.map(genre => (
                <span key={genre.id} className="genre-tag">{genre.name}</span>
              ))}
            </div>

            <div style={{ marginTop: '0.5rem' }}>
              <h2 className="heading-3" style={{ marginBottom: '0.5rem' }}>Synopsis</h2>
              <p style={{ fontSize: '1.125rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.85)' }}>
                {movie.overview}
              </p>
            </div>

            {credits && credits.cast && credits.cast.length > 0 && (
              <div style={{ marginTop: '3rem' }}>
                <h2 className="heading-3" style={{ marginBottom: '1rem' }}>Top Cast</h2>
                <div className="cast-grid">
                  {credits.cast.slice(0, 8).map(castMember => (
                    <div key={castMember.id} className="cast-member">
                      <img 
                        src={castMember.profile_path ? `${PROFILE_BASE_URL}${castMember.profile_path}` : 'https://via.placeholder.com/150x150?text=No+Photo'} 
                        alt={castMember.name} 
                        className="cast-photo"
                      />
                      <div className="cast-name">{castMember.name}</div>
                      <div className="cast-role">{castMember.character}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MovieDetails;
