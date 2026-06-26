import { useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import "./App.css";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import fetchMovies from "../../services/movieService";
import type { Movie } from "../../types/movie";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import Paginate from "../ReactPaginate/ReactPaginate";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

const App = () => {
  const [page, setPage] = useState<number>(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState<string>("");

  const { data, isLoading, isError, isPlaceholderData } = useQuery({
    queryKey: ["movies", query, page],
    queryFn: async () => {
      const res = await fetchMovies(query, page);
      if (!res || res.results.length === 0) {
        toast.error("No movies found for your request.");
        return { results: [], total_pages: 0 };
      }
      return res;
    },
    enabled: Boolean(query),
    placeholderData: keepPreviousData,
    meta: {
      onError: () => {
        toast.error("Something went wrong. Please try again.");
      },
    },
  });

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleSearchSubmit = (newQuery: string) => {
    setPage(1);
    setQuery(newQuery);
  };

  const movies = (data && data.results) || [];
  const totalPages = (data && data.total_pages) || 0;

  return (
    <div>
      <SearchBar onSubmit={handleSearchSubmit} />
      {isError && <ErrorMessage />}

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}

      {!isError && movies.length > 0 && (
        <>
          <div style={{ opacity: isPlaceholderData ? 0.6 : 1 }}>
            <MovieGrid movies={movies} onSelect={handleSelectMovie} />
            <Paginate totalPages={totalPages} page={page} setPage={setPage} />
          </div>
        </>
      )}

      {isLoading && <Loader />}
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default App;
