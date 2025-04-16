require("dotenv").config();

// ************************ //
// ***** my constants ***** //
// ************************ //

const express = require("express");
const { Liquid } = require("liquidjs");
const path = require("path");

const app = express();
const engine = new Liquid();




// **************************** //
// ***** engine of choice ***** //
// **************************** //

app.engine("liquid", engine.express());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "liquid");
app.use(express.static("public"));


// ********************* //
// ***** the api's ***** //
// ********************* //

const url = 'https://api.themoviedb.org/3/discover/movie'; 
const genres = 'https://api.themoviedb.org/3/genre/movie/list?language=en';

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${process.env.API_KEY}`
  }
};



// Define routes
app.get("/", async (req, res) => {
  let movies = [];

  try {
    // Fetch genres
    const genreRes = await fetch(genres, options);
    const genreJson = await genreRes.json();

    // Map genres to numbers
    const genreMap = genreJson.genres.reduce((map, genre, index) => {
      map[genre.id] = {
        name: genre.name.toLowerCase().replace(/\s+/g, "-"), // Convert genre names to lowercase and replace spaces with dashes
        index: index + 1 // Assign a number starting from 1
      };
      return map;
    }, {});

    // Fetch 6 movies for each genre
    for (const genre of genreJson.genres) {
      const genreMoviesUrl = `${url}?with_genres=${genre.id}&page=1`;
      const movieRes = await fetch(genreMoviesUrl, options);
      const movieJson = await movieRes.json();

      const genreMovies = movieJson.results
        .filter(movie => movie.poster_path) // Only include movies with a valid poster_path
        .slice(0, 6) // Limit to 6 movies
        .map(movie => ({
          id: movie.id, // Include the movie ID
          image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          genre: genreMap[movie.genre_ids[0]]?.name || "unknown", // Use only the first genre or "unknown" if no genre exists
          genreIndex: genreMap[movie.genre_ids[0]]?.index || 0 // Use the corresponding number or 0 if no genre exists
        }));

      movies = movies.concat(genreMovies); // Add movies to the array
    }

    // Shuffle the movies array
    movies = movies.sort(() => Math.random() - 0.5);

    res.render("index", { movies });
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).send("Failed to load movies");
  }
});


app.get("/movie/:id", async (req, res) => {
  const movieId = req.params.id;

  const detailUrl = `https://api.themoviedb.org/3/movie/${movieId}`;
  const videoUrl = `https://api.themoviedb.org/3/movie/${movieId}/videos`;

  try {
    // Fetch movie details
    const response = await fetch(detailUrl, options);
    const movie = await response.json();

    // Fetch videos (trailers, teasers, etc.)
    const videoRes = await fetch(videoUrl, options);
    const videoJson = await videoRes.json();

    // Find the YouTube trailer
    const trailer = videoJson.results.find(video =>
      video.site === "YouTube" && video.type === "Trailer"
    );

    const movieData = {
      title: movie.title,
      description: movie.overview,
      image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      trailerUrl: trailer ? `https://www.youtube.com/embed/${trailer.key}` : null
    };

    res.render("movie", { movie: movieData });
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong while fetching the movie details.");
  }
});


// API route for loading more movies
app.get("/api/movies", async (req, res) => {
  const page = parseInt(req.query.page) || 1;

  try {
    // Fetch genres
    const genreRes = await fetch(genres, options);
    const genreJson = await genreRes.json();

    // Map genres to numbers
    const genreMap = genreJson.genres.reduce((map, genre, index) => {
      map[genre.id] = {
        name: genre.name.toLowerCase().replace(/\s+/g, "-"), // Convert genre names to lowercase and replace spaces with dashes
        index: index + 1 // Assign a number starting from 1
      };
      return map;
    }, {});

    // Fetch movies for the requested page
    const movieRes = await fetch(`${url}?page=${page}`, options);
    const movieJson = await movieRes.json();

    const movies = movieJson.results
      .filter(movie => movie.poster_path) // Only include movies with a valid poster_path
      .map(movie => ({
        id: movie.id,
        image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        genre: genreMap[movie.genre_ids[0]]?.name || "unknown", // Use only the first genre or "unknown" if no genre exists
        genreIndex: genreMap[movie.genre_ids[0]]?.index || 0 // Use the corresponding number or 0 if no genre exists
      }));

    res.json(movies);
  } catch (err) {
    console.error("API Error:", err);
    res.status(500).json({ error: "Failed to fetch movies" });
  }
});





// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});



