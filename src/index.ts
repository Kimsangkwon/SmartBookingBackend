import express from "express";
import dotenv from "dotenv-safe";
import cors from "cors";
import dependencies from "./infrastructure/dependencies";
import userRoutes from "./ports/rest/routes/user";
import searchRoutes from "./ports/rest/routes/search";
import homeRoutes from "./ports/rest/routes/home";
import concertRoutes from "./ports/rest/routes/concerts";
import sportRoutes from "./ports/rest/routes/sports";
import otherRoutes from "./ports/rest/routes/others";
import eventDetailRoutes from "./ports/rest/routes/eventDetails";
import wishlistRoutes from "./ports/rest/routes/wishlist";
import billingRoutes from "./ports/rest/routes/billing";
import purchaseRoutes from "./ports/rest/routes/purchase";
import myTicketRoutes from "./ports/rest/routes/myTicket";
import cartRoutes from "./ports/rest/routes/cart";
import reviewRoutes from "./ports/rest/routes/review";
import adminReviewRoutes from "./ports/rest/routes/admin/reviewManagement";
import guestRouters from "./ports/rest/routes/guestPurchase";
import adminAllPurchasesRoutes from "./ports/rest/routes/admin/allPurchases";
import adminAllUsersRoutes from "./ports/rest/routes/admin/allUsers";


const app = express();

// Middlewares
app.use(express.urlencoded({ extended: false }));
// Allow frontend requests from localhost:5173
app.use(cors({
  origin: "http://localhost:5173",
  methods: "GET,POST,PUT,DELETE",
  credentials: true // Allow cookies if needed
}));
app.use(express.json());

dotenv.config();

const {mongoDbClient} = dependencies;
mongoDbClient.ConnectToDb();

// Routes
app.use("/user", userRoutes);
app.use("/search", searchRoutes);
app.use("/home", homeRoutes);
app.use("/concerts", concertRoutes);
app.use("/sports",sportRoutes);
app.use("/others", otherRoutes);
app.use("/eventDetail", eventDetailRoutes);
app.use("/wishlist", wishlistRoutes);
app.use("/billing", billingRoutes);
app.use("/purchase", purchaseRoutes);
app.use("/myTicket", myTicketRoutes);
app.use("/cart", cartRoutes);
app.use("/review", reviewRoutes);
app.use("/admin/reviews",adminReviewRoutes);
app.use("/guest", guestRouters);
app.use("/admin/allPurchases", adminAllPurchasesRoutes);
app.use("/admin/allUsers",adminAllUsersRoutes );


const port = 4000;

app.listen(port, () => {
  console.log(`Now listening on port ${port}`);
});

export default app;
