import { useState, useEffect } from "react";
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

const App = () => {
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleSearchSubmit = (newQuery: string) => {
    setMovies([]);
    setError(false);
    setPage(1);
    setQuery(newQuery);
  };

  useEffect(() => {
    if (!query) return;

    const getMovies = async () => {
      setIsLoading(true);
      try {
        const data = await fetchMovies(query, page);

        if (!data || data.results.length === 0) {
          toast.error("No movies found for your request.");
          setMovies([]);
          return;
        }

        setMovies(data.results);
        setTotalPages(data.total_pages);
      } catch {
        setError(true);
        toast.error("Something went wrong. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    getMovies();
  }, [query, page]);

  return (
    <div>
      <SearchBar onSubmit={handleSearchSubmit} />
      {error && <ErrorMessage />}

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}

      {!error && movies.length > 0 && (
        <>
          <MovieGrid movies={movies} onSelect={handleSelectMovie} />
          <Paginate totalPages={totalPages} page={page} setPage={setPage} />
        </>
      )}

      {isLoading && <Loader />}
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default App;
