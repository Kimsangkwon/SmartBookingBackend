import { Router, Request, Response } from "express";
import { authenticateToken, isAdmin } from "../../middleware/authentication";
import { getAllUsersWithProfiles } from "../../../../infrastructure/mongodb/queries/user";

const router = Router();

//get all users
router.get("/", authenticateToken, isAdmin, async (req: Request, res: Response) => {
    try {
        const userList = await getAllUsersWithProfiles();
        res.status(200).json({userList});
    } catch (error) {
      console.error("Error fetching user list:", error);
      res.status(500).json({ error: "Failed to fetch user list" });
    }
  });

export default router;
