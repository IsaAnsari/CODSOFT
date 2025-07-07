import React from 'react';
import './SearchBar.css'; // We will create this CSS file next

function SearchBar({ onSearchChange }) {
    return (
        <div className="search-bar-container">
            <input
                type="text"
                placeholder="Search for jobs by title, company, or location..."
                className="search-input"
                onChange={(e) => onSearchChange(e.target.value)}
            />
            <button className="search-button">Search</button>
        </div>
    );
}

export default SearchBar;