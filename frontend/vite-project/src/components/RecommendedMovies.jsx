import React, { useEffect, useState } from "react";
import { Link } from "react-router";

const RecommendedMovies = ({ movieTitles }) => {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NTgzMDFlZGQ2MGEzN2Y3NDlmMzhlNGFmMTJjZDE3YSIsIm5iZiI6MTc0NTQxNjIyNS44NzY5OTk5LCJzdWIiOiI2ODA4ZjAyMTI3NmJmNjRlNDFhYjY0ZWUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.NA_LMt6-MUBLAvxMRkZtBoUif4p9YQ6aYZo-lv4-PUE",
    },
  };

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMovie = async (title) => {
    const encodedTitle = encodeURIComponent(title);
    const url = `https://api.themoviedb.org/3/search/movie?query=${encodedTitle}&include_adult=false&language=en-US&page=1`;

    try {
      const res = await fetch(url, options);
      const data = await res.json();
      return data.results?.[0] || null;
    } catch (error) {
      console.log("Error fetching movie: ", error);
      return null;
    }
  };

  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      const results = await Promise.all(
        movieTitles.map((title) => fetchMovie(title))
      );
      setMovies(results.filter(Boolean));
      setLoading(false);
      console.log(movies);
    };

    if (movieTitles?.length) {
      loadMovies();
    }
  }, [movieTitles]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {movies.map((movie) => (
        <Link
          to={`/movie/${movie.id}`}
          key={movie.id}
          className="bg-[#232323] rounded-lg overflow-hidden"
        >
          {movie.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
              className="w-full h-48 object-cover"
            />
          ) : (
            <>No Image</>
          )}

          <div className="p-2">
            <h3 className="text-sm font-semibold text-white truncate">
              {movie.title}
            </h3>
            <p className="text-xs text-gray-400">
              {movie.release_date ? movie.release_date.slice(0, 4) : "N/A"}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default RecommendedMovies;