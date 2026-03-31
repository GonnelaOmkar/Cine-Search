import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film, Search as SearchIcon } from 'lucide-react';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <Film className="h-6 w-6" style={{ color: 'var(--accent)' }} />
          <span>CineSearch</span>
        </Link>
        <form onSubmit={handleSearch} className="navbar-search">
          <SearchIcon className="search-icon" />
          <input
            type="text"
            placeholder="Search movies by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>
    </header>
  );
};

export default Navbar;
