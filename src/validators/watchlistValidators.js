import { z } from "zod";

const addToWatchlistSchema = z.object({
  movieId: z.string().uuid(),
  status: z
    .enum(["PLANNED", "WATCHING", "COMPLETED", "DROPPED"], {
      message: "Status must be one of: PLANNED, WATCHING, COMPLETED, DROPPED",
    })
    .optional(),
  rating: z
    .int()
    .min(1, "Rating must be between 1 and 10")
    .max(10, "Rating must be between 1 and 10")
    .optional(),
  notes: z.string().optional(),
});

const updateWatchlistSchema = z.object({
  status: z.enum(["PLANNED", "WATCHING", "COMPLETED", "DROPPED"], {
    message: "Status must be one of: PLANNED, WATCHING, COMPLETED, DROPPED",
  }),
  rating: z
    .int()
    .min(1, "Rating must be between 1 and 10")
    .max(10, "Rating must be between 1 and 10")
    .optional(),
  notes: z.string().optional(),
});

export { addToWatchlistSchema, updateWatchlistSchema };
