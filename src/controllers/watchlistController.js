import { prisma } from "../config/db.js";

const addToWatchlist = async (req, res) => {
  const { movieId, status, rating, notes } = req.body;

  //Verify if the movie exist
  const movieExist = await prisma.movie.findUnique({
    where: { id: movieId },
  });

  if (!movieExist) {
    return res.status(404).json({ error: "Movie not found" });
  }

  //verify if not already added to a watchlist
  const alreadyAddedToWatchlist = await prisma.watchlistItem.findUnique({
    where: {
      userId_movieId: {
        userId: req.user.id,
        movieId: movieId,
      },
    },
  });

  if (alreadyAddedToWatchlist) {
    return res
      .status(400)
      .json({ error: "Movie already added to a watchlist" });
  }

  const watchlistItem = await prisma.watchlistItem.create({
    data: {
      userId: req.user.id,
      movieId,
      status: status || "PLANNED",
      rating,
      notes,
    },
  });

  res.status(201).json({ status: "success", data: { watchlistItem } });
};

const removeFromWatchlist = async (req, res) => {
  const watchlistItem = await prisma.watchlistItem.findUnique({
    where: { id: req.params.id },
  });

  if (!watchlistItem) {
    return res.status(404).json({ error: "Watchlist not found" });
  }

  if (watchlistItem.userId !== req.user.id) {
    return res
      .status(403)
      .json({ error: "Not allowed to update this watchlist item" });
  }

  await prisma.watchlistItem.delete({
    where: { id: req.params.id },
  });

  res.status(200).json({
    status: "success",
    message: "Movie removed form the watchlist item",
  });
};

export { addToWatchlist, removeFromWatchlist };
