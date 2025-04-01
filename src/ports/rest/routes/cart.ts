import express, { NextFunction, Response, Request } from "express";
import { ConnectToDb } from "../../../infrastructure/mongodb/connection";
import { authenticateToken } from "../middleware/authentication";
import { createCartItem, deleteCartItem, getCartByUserId } from "../../../infrastructure/mongodb/queries/cart";

const router = express.Router();

ConnectToDb();

// Add to Cart
router.post("/", authenticateToken, async(req:Request, res: Response)=>{
    try{
        const { eventId, name, date, image, venue } = req.body;
        const userId = (req as any).user.id;
        const cart = await createCartItem(userId, {
            eventId, name, date, image, venue
        });
        res.status(201).json({message:"Event added to cart", cart});
    }
    catch(error){
        console.error("Error adding to cart:", error);
        res.status(500).json({ error: "Failed to add to cart" });
    }
});

//Get Cart
router.get("/", authenticateToken, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const cart = await getCartByUserId(userId);
        res.status(200).json({ cart });
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).json({ error: "Failed to fetch cart" });
    }
});

//Remove from Cart
router.delete("/:eventId", authenticateToken, async(req:Request, res:Response)=>{
        try {
            const { eventId } = req.params;
            const userId = (req as any).user.id;
    
            const result = await deleteCartItem(userId, eventId);
    
            if (!result) {
                return res.status(404).json({ message: "Event not found in cart" });
            }
    
            res.status(200).json({ message: "Event removed from cart" });
        } catch (error) {
            console.error("Error removing from cart:", error);
            res.status(500).json({ error: "Failed to remove from cart" });
        }
});

export = router;
