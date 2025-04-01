import { Request, Response } from "express";
import { Router } from "express";
import { authenticateToken } from "../middleware/authentication";
import { createBillingInfo, deleteBillingInfo, getBillingInfoById, getBillingInfosByUserId, updateBillingInfo } from "../../../infrastructure/mongodb/queries/billing";

const router = Router();

//Add Biling Info
router.post("/", authenticateToken, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const billing = await createBillingInfo(userId, req.body);
      res.status(201).json({ message: "Billing info added", billing });
    } catch (error) {
      console.error("Error adding billing info:", error);
      res.status(500).json({ error: "Failed to add billing info" });
    }
  });
  //Get All Billing Info
router.get("/", authenticateToken, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const cards = await getBillingInfosByUserId(userId);
      res.status(200).json({ cards });
    } catch (error) {
      console.error("Error fetching billing info list:", error);
      res.status(500).json({ error: "Failed to fetch billing info list" });
    }
  });
  //Get Billing Info Detail
router.get("/:id", authenticateToken, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const { id } = req.params;
      const billing = await getBillingInfoById(userId, id);
      if (!billing) return res.status(404).json({ message: "Billing info not found" });
      res.status(200).json({ billing });
    } catch (error) {
      console.error("Error fetching billing detail:", error);
      res.status(500).json({ error: "Failed to fetch billing detail" });
    }
  });
  //Update Billing Info
router.put("/:id", authenticateToken, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const { id } = req.params;
      const updated = await updateBillingInfo(userId, id, req.body);
      if (!updated) return res.status(404).json({ message: "Billing info not found" });
      res.status(200).json({ message: "Billing info updated", updated });
    } catch (error) {
      console.error("Error updating billing info:", error);
      res.status(500).json({ error: "Failed to update billing info" });
    }
  });
  //Delete Billing Info
router.delete("/:id", authenticateToken, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const { id } = req.params;
      const result = await deleteBillingInfo(userId, id);
      if (!result) return res.status(404).json({ message: "Billing info not found" });
      res.status(200).json({ message: "Billing info deleted" });
    } catch (error) {
      console.error("Error deleting billing info:", error);
      res.status(500).json({ error: "Failed to delete billing info" });
    }
  });

export default router;
