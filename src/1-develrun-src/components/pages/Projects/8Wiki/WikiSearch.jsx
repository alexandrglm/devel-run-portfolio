import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const WikiSearch = ({ value, onChange, results, onResultClick }) => {
  const inputRef = useRef(null);
  const resultsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target)) {
        onResultClick?.();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onResultClick]);

  useEffect(() => {

    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        inputRef.current?.blur();
        onResultClick?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onResultClick]);

  return (
    <div className="wiki-search-container" ref={resultsRef}>
      <div className="wiki-search-input-wrapper">
        <span className="search-icon">🔍</span>
        <input
        ref={inputRef}
        type="text"
        placeholder="Find in docs ... (Ctrl+K / Cmd+K)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="wiki-search-input" />

        {value &&
        <button
        className="search-clear"
        onClick={() => onChange('')}>

            ✕
          </button>}

      </div>

      {results.length > 0 &&
      <div className="wiki-search-results">
          {results.map((result) =>
        <Link
        key={result.id}
        to={result.path}
        className="wiki-search-result"
        onClick={onResultClick}>

              <div className="result-title">{result.title}</div>
              <div className="result-section">{result.section}</div>
            </Link>)}

        </div>}

    </div>);

};

export default WikiSearch;