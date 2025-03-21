import express, { NextFunction, Response, Request } from "express";
import { ConnectToDb } from "../../../infrastructure/mongodb/connection";
import { authenticateToken } from "../middleware/authentication";
import { createWishlistItem, deleteWishlistItem, getWishlistByUserId } from "infrastructure/mongodb/queries/wishlist";

const router = express.Router();

ConnectToDb();


router.use(authenticateToken); // Protect all wishlist routes

// ➕ Add to Wishlist
router.post("/", async(req:Request, res: Response)=>{
    try{
        const { eventId, name, date, image, venue } = req.body;
        const userId = (req as any).user.id;
        const wishlist = await createWishlistItem(userId, {
            eventId, name, date, image, venue
        });
        res.status(201).json({message:"Event added to wishlist", wishlist});
    }
    catch(error){
        console.error("❌ Error adding to wishlist:", error);
        res.status(500).json({ error: "Failed to add to wishlist" });
    }
});

// 📄 Get Wishlist
router.get("/", async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const wishlist = await getWishlistByUserId(userId);
        res.status(200).json({ wishlist });
    } catch (error) {
        console.error("❌ Error fetching wishlist:", error);
        res.status(500).json({ error: "Failed to fetch wishlist" });
    }
});

// ❌ Remove from Wishlist
router.delete("/:eventId", async(req:Request, res:Response)=>{
        try {
            const { eventId } = req.params;
            const userId = (req as any).user.id;
    
            const result = await deleteWishlistItem(userId, eventId);
    
            if (!result) {
                return res.status(404).json({ message: "Event not found in wishlist" });
            }
    
            res.status(200).json({ message: "Event removed from wishlist" });
        } catch (error) {
            console.error("❌ Error removing from wishlist:", error);
            res.status(500).json({ error: "Failed to remove from wishlist" });
        }
});

export = router;
