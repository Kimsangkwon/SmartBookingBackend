import { Router, Request, Response } from "express";
import { authenticateToken } from "../middleware/authentication";
import { createReview, getApprovedReviewsByEventId, updateReviewById, deleteReviewById } from "../../../infrastructure/mongodb/queries/review";

const router = Router();

// add review
router.post("/", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { eventId, content, rating, userName } = req.body;
    const userId = (req as any).user.id;

    const review = await createReview({ userId, eventId, content, rating, userName });
    res.status(201).json({ message: "Review submitted and pending approval", review });
  } catch (error) {
    console.error("Error submitting review:", error);
    res.status(500).json({ error: "Failed to submit review" });
  }
});

// get all approved review
router.get("/:eventId", async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    if (!eventId) {
      return res.status(400).json({ error: "Event ID is required" });
    }

    const reviews = await getApprovedReviewsByEventId(eventId);
    res.status(200).json({ reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});
// edit review
router.put("/:reviewId", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { reviewId } = req.params;
    const userId = (req as any).user.id;
    const { content, rating } = req.body;

    const updated = await updateReviewById(reviewId, userId, { content, rating });
    if (!updated) {
      return res.status(404).json({ error: "Review not found or unauthorized" });
    }

    res.status(200).json({ message: "Review updated and pending approval again", updated });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ error: "Failed to update review" });
  }
});
//delete review
router.delete("/:reviewId", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { reviewId } = req.params;
    const userId = (req as any).user.id;

    const deleted = await deleteReviewById(reviewId, userId);
    if (!deleted) {
      return res.status(404).json({ error: "Review not found or unauthorized" });
    }

    res.status(200).json({ message: "Review deleted" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ error: "Failed to delete review" });
  }
});



export default router;
