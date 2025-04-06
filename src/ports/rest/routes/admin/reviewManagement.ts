import { Router, Request, Response } from "express";
import { authenticateToken, isAdmin } from "../../middleware/authentication";
import { getPendingReviews, approveReviewById, declineReviewById, getAppApprovedReviews } from "../../../../infrastructure/mongodb/queries/review";

const router = Router();

// Get all pending reviews
router.get("/pending", authenticateToken, isAdmin, async (req: Request, res: Response) => {
  try {
    const reviews = await getPendingReviews();
    res.status(200).json({ pendingReviews: reviews });
  } catch (error) {
    console.error("Error fetching pending reviews:", error);
    res.status(500).json({ error: "Failed to fetch pending reviews" });
  }
});

//Get all approved reviews
router.get("/approved", authenticateToken, isAdmin, async (req:Request, res:Response)=>{
  try{
    const reviews = await getAppApprovedReviews();
    res.status(200).json({approvedReviews: reviews});
  }catch (error){
    console.error("Error fetching approved reviews:", error);
    res.status(500).json({error:"failed to fetch approved reviews"});
  }
})

// Approve review
router.post("/:id/approve", authenticateToken, isAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await approveReviewById(id);
    if (!updated) return res.status(404).json({ message: "Review not found" });

    res.status(200).json({ message: "Review approved", review: updated });
  } catch (error) {
    console.error("Error approving review:", error);
    res.status(500).json({ error: "Failed to approve review" });
  }
});

// Decline (delete) review
router.delete("/:id/decline", authenticateToken, isAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await declineReviewById(id);
    if (!deleted) return res.status(404).json({ message: "Review not found" });

    res.status(200).json({ message: "Review declined and deleted" });
  } catch (error) {
    console.error("Error declining review:", error);
    res.status(500).json({ error: "Failed to decline review" });
  }
});

export default router;
