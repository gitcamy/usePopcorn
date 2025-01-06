

export function NumSearchResults({ movies }) {
    return (
      <p className="num-results">
        Found <strong>{movies.length}</strong> results
      </p>
    );
  }
  
  export function Search({ query, setQuery }) {
    return (
      <input
        className="search"
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    );
  }