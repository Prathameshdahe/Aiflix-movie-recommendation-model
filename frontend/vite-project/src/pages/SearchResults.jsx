import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import cardimg from "../assets/cardimg.jpg";

const SearchResults = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    axios
      .get(`http://localhost:5000/api/search?q=${encodeURIComponent(query)}`)
      .then(res => setResults(res.data.results || []))
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div style={{ padding: "2rem", color: "#fff" }}>
      <h2 style={{ color: "#fff" }}>Results for "{query}"</h2>
      {loading && <p style={{ color: "#fff" }}>Loading...</p>}
      {!loading && results.length === 0 && <p style={{ color: "#fff" }}>No results found.</p>}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {results.map(movie => (
          <div
            key={movie.id}
            style={{ width: 200, cursor: "pointer" }}
            onClick={() => navigate(`/movie/${movie.id}`)}
          >
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                  : cardimg
              }
              alt={movie.title}
              style={{ width: "100%" }}
            />
            <div style={{ background: "#222", padding: "1rem", borderRadius: "8px", color: "#fff" }}>
              <strong>{movie.title}</strong>
              <div>{movie.release_date?.slice(0, 4)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;