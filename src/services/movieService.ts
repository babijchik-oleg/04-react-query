import axios from "axios";
import type { Movie } from "../types/movie";

const TMDB_ACCESS_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

interface TmdbResponse {
  results: Movie[];
  page: number;
  total_pages: number;
  total_results: number;
}

async function fetchMovies(query: string): Promise<Movie[]> {
  if (!TMDB_ACCESS_TOKEN) {
    console.error("TMDB Access Token is missing! Check your .env file.");
  }

  const config = {
    params: {
      query: query,
      include_adult: false,
      language: "en-US",
    },
    headers: {
      Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
    },
  };

  try {
    const response = await axios.get<TmdbResponse>(
      "https://api.themoviedb.org/3/search/movie",
      config,
    );

    return response.data.results;
  } catch (error) {
    console.error("Error fetching movies:", error);
    return [];
  }
}
export default fetchMovies;
