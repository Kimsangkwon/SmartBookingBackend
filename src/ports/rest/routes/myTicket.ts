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
router.get("/:id", authenticateToken, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const purchase = await getTicketById(id);
      if (!purchase) return res.status(404).json({ message: "Purchase not found" });
  
      res.status(200).json({ purchase });
    } catch (error) {
      console.error("Error fetching purchase:", error);
      res.status(500).json({ error: "Failed to fetch purchase" });
    }
  });
//Remove selected ticket
router.delete("/:id", authenticateToken, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
  
      const deleted = await deleteTicket(id, userId);
      if (!deleted) return res.status(404).json({ message: "Purchase not found or unauthorized" });
  
      res.status(200).json({ message: "Purchase cancelled" });
    } catch (error) {
      console.error("Error deleting purchase:", error);
      res.status(500).json({ error: "Failed to delete purchase" });
    }
  });
  export default router;
