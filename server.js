const express = require("express");
const { Liquid } = require("liquidjs");
const path = require("path");

const app = express();
const engine = new Liquid();

// Set Liquid as the template engine
app.engine("liquid", engine.express()); 
app.set("views", path.join(__dirname, "views")); 
app.set("view engine", "liquid");

// Sample movie data
const movies = [
  { title: "Inception", image_url: "/images/inception.jpg", description: "A mind-bending thriller." },
  { title: "The Matrix", image_url: "/images/matrix.jpg", description: "A cyberpunk classic." }
];

// Serve static files (e.g., images, CSS)
app.use(express.static("public"));

// Define routes
app.get("/", (req, res) => {
  res.render("index", { movies });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
