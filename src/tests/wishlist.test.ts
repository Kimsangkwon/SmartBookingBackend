import request from "supertest";
import app from "../index";
import * as wishlistQueries from "../infrastructure/mongodb/queries/wishlist";

jest.mock("../ports/rest/middleware/authentication", () => ({
  authenticateToken: (req: any, res: any, next: any) => {
    req.user = { id: "mockUserId" };
    next();
  },
}));

jest.mock("../infrastructure/mongodb/queries/wishlist");

describe("🌟 Wishlist API", () => {
  const mockWishlistItem = {
    _id: "123",
    eventId: "event123",
    name: "Event A",
    date: "2025-05-01",
    image: "https://img.com",
    venue: "Venue A",
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("✅ should add an event to wishlist", async () => {
    (wishlistQueries.createWishlistItem as jest.Mock).mockResolvedValue(mockWishlistItem);

    const res = await request(app).post("/wishlist").send({
      eventId: "event123",
      name: "Event A",
      date: "2025-05-01",
      image: "https://img.com",
      venue: "Venue A",
    });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Event added to wishlist");
    expect(wishlistQueries.createWishlistItem).toHaveBeenCalledWith("mockUserId", {
      eventId: "event123",
      name: "Event A",
      date: "2025-05-01",
      image: "https://img.com",
      venue: "Venue A",
    });
  });

  it("✅ should fetch wishlist", async () => {
    (wishlistQueries.getWishlistByUserId as jest.Mock).mockResolvedValue([mockWishlistItem]);

    const res = await request(app).get("/wishlist");

    expect(res.status).toBe(200);
    expect(res.body.wishlist).toEqual([mockWishlistItem]);
    expect(wishlistQueries.getWishlistByUserId).toHaveBeenCalledWith("mockUserId");
  });

  it("✅ should remove an event from wishlist", async () => {
    (wishlistQueries.deleteWishlistItem as jest.Mock).mockResolvedValue(true);

    const res = await request(app).delete("/wishlist/event123");

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Event removed from wishlist");
    expect(wishlistQueries.deleteWishlistItem).toHaveBeenCalledWith("mockUserId", "event123");
  });

  it("❌ should return 404 if trying to delete non-existent wishlist item", async () => {
    (wishlistQueries.deleteWishlistItem as jest.Mock).mockResolvedValue(false);

    const res = await request(app).delete("/wishlist/nonexistent");

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Event not found in wishlist");
  });

  it("❌ should handle error when adding to wishlist", async () => {
    (wishlistQueries.createWishlistItem as jest.Mock).mockRejectedValue(new Error("DB Error"));

    const res = await request(app).post("/wishlist").send({
      eventId: "event123",
      name: "Event A",
      date: "2025-05-01",
      image: "https://img.com",
      venue: "Venue A",
    });

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("error", "Failed to add to wishlist");
  });
});
