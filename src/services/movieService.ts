import axios from "axios";
import type { Movie } from "../types/movie";

const TMDB_ACCESS_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

interface TmdbResponse {
  results: Movie[];
  page: number;
  total_pages: number;
  total_results: number;
}

async function fetchMovies(
  query: string,
  page: number = 1,
): Promise<TmdbResponse | null> {
  if (!TMDB_ACCESS_TOKEN) {
    console.error("TMDB Access Token is missing! Check your .env file.");
  }

  const config = {
    params: {
      query: query,
      page: page,
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

    return response.data;
  } catch (error) {
    console.error("Error fetching movies:", error);
    return null;
  }
}
export default fetchMovies;
