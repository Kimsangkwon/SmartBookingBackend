import {
    getCartByUserId,
  } from "../../src/infrastructure/mongodb/queries/cart";
  
  import { CartModel } from "../../src/infrastructure/mongodb/models/cart";
  
  // ✅ Mock CartModel
  jest.mock("../../src/infrastructure/mongodb/models/cart");
  
  describe("🛒 Cart Query Functions", () => {
    const mockUserId = "user123";
    const mockEventData = {
      eventId: "event456",
      name: "Sample Event",
      date: "2025-01-01",
      venue: "Test Venue",
      price: 100,
      quantity: 2
    };
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it("✅ getCartByUserId - should return sorted cart list", async () => {
      const mockSort = jest.fn().mockResolvedValue([{ eventId: "event123" }]);
      (CartModel.find as jest.Mock).mockReturnValue({ sort: mockSort });
  
      const result = await getCartByUserId(mockUserId);
  
      expect(CartModel.find).toHaveBeenCalledWith({ userId: mockUserId });
      expect(mockSort).toHaveBeenCalledWith({ addAt: -1 });
      expect(result[0].eventId).toBe("event123");
    });
  

  });
  