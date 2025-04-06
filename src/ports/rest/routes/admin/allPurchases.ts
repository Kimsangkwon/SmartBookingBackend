import { Router, Request, Response } from "express";
import { PurchaseModel } from "../../../../infrastructure/mongodb/models/purchase";
import { GuestPurchaseModel } from "../../../../infrastructure/mongodb/models/guestPurchase";
import { authenticateToken, isAdmin } from "../../middleware/authentication";

const router = Router();

//get all purchases from all users
router.get("/", authenticateToken, isAdmin, async (req: Request, res: Response) => {
    try {
      const userPurchases = await PurchaseModel.find({});
      const guestPurchases = await GuestPurchaseModel.find({});
  
      res.status(200).json({
        userPurchases,
        guestPurchases
      });
    } catch (error) {
      console.error("Error fetching purchases:", error);
      res.status(500).json({ error: "Failed to fetch purchases" });
    }
  });

export default router;
