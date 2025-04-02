import { Router } from "express";
import { Request, Response } from "express";
import { authenticateToken } from "../middleware/authentication";
import { getUpcomingTickets, getPastTickets, getTicketById, deleteTicket } from "../../../infrastructure/mongodb/queries/myTicket";

const router = Router();

//Get upcomming tickets
router.get("/upComming", authenticateToken, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
  
      const upcoming = await getUpcomingTickets(userId);
  
      res.status(200).json({
        upcomingTickets: upcoming,
      });
    } catch (error) {
      console.error("Error fetching categorized purchases:", error);
      res.status(500).json({ error: "Failed to fetch purchase history" });
    }
  });

  //Get past tickets
  router.get("/past", authenticateToken, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
  
      const past = await getPastTickets(userId);
  
      res.status(200).json({
        pastTickets: past,
      });
    } catch (error) {
      console.error("Error fetching categorized purchases:", error);
      res.status(500).json({ error: "Failed to fetch purchase history" });
    }
  });
  //Get selected ticket information
  router.get("/:purchaseId/:eventId", authenticateToken, async (req: Request, res: Response) => {
    try {
      const { purchaseId, eventId } = req.params;
      const ticket = await getTicketById(purchaseId, eventId);
      if (!ticket) return res.status(404).json({ message: "Ticket not found" });
  
      res.status(200).json({ ticket });
    } catch (error) {
      console.error("Error fetching ticket:", error);
      res.status(500).json({ error: "Failed to fetch ticket" });
    }
  });
//Remove selected ticket
router.delete("/:purchaseId/:eventId", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { purchaseId, eventId } = req.params;
    const { confirmDeleteAll } = req.body;
    const userId = (req as any).user.id;

    const result = await deleteTicket(purchaseId, eventId, userId, confirmDeleteAll === true);

    if (!result) {
      return res.status(404).json({ message: "Ticket not found or unauthorized" });
    }

    // confirmation required
    if (result.confirmRequired) {
      return res.status(409).json({ message: result.message });
    }

    return res.status(200).json({ message: result.message || "Ticket deleted successfully" });
  } catch (error) {
    console.error("Error deleting ticket:", error);
    res.status(500).json({ error: "Failed to delete ticket" });
  }
});

  export default router;
