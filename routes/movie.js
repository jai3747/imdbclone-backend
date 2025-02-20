const Movie = require("../models/movieSchema");

const router = require("express").Router();

router.get("/", async (req, res) => {
  try {
    const movies = await Movie.find().populate("actors").populate("producer");
    res.json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id).populate("actors").populate("producer");
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.json(movie);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

router.post("/add-movie", async (req, res) => {
  try {
    const { name,desc,director, yearOfRelease,poster, producer, actors } = req.body;
    const movie = new Movie({
      name,
      desc,
      director,
      yearOfRelease,
      poster,
      producer,
      actors,
    });
    await movie.save();
    res.json(movie);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

router.put("/edit-movie/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, desc, director, yearOfRelease, poster, producer, actors } = req.body;
    const updatedMovie = await Movie.findByIdAndUpdate(id, {
      name,
      desc,
      director,
      yearOfRelease,
      poster,
      producer,
      actors,
    }, { new: true });
    res.json(updatedMovie);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Delete a movie
router.delete("/delete-movie/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Movie.findByIdAndDelete(id);
    res.json({ message: "Movie deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
