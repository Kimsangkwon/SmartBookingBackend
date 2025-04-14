import {
    getUpcomingTickets,
    getPastTickets,
    getTicketById,
    deleteTicket
  } from "../../src/infrastructure/mongodb/queries/myTicket";
  
  import { PurchaseModel } from "../../src/infrastructure/mongodb/models/purchase";
  
  // ✅ Mock PurchaseModel
  jest.mock("../../src/infrastructure/mongodb/models/purchase");
  
  describe("🎟️ Purchase Query Functions", () => {
    const mockUserId = "user123";
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it("✅ getUpcomingTickets - should find upcoming events", async () => {
      const mockSort = jest.fn().mockResolvedValue([{ eventId: "future1" }]);
      (PurchaseModel.find as jest.Mock).mockReturnValue({ sort: mockSort });
  
      const result = await getUpcomingTickets(mockUserId);
  
      expect(PurchaseModel.find).toHaveBeenCalledWith({
        userId: mockUserId,
        eventDate: { $gte: expect.any(String) }
      });
      expect(mockSort).toHaveBeenCalledWith({ eventDate: 1 });
      expect(result[0].eventId).toBe("future1");
    });
  
    it("✅ getPastTickets - should find past events", async () => {
      const mockSort = jest.fn().mockResolvedValue([{ eventId: "past1" }]);
      (PurchaseModel.find as jest.Mock).mockReturnValue({ sort: mockSort });
  
      const result = await getPastTickets(mockUserId);
  
      expect(PurchaseModel.find).toHaveBeenCalledWith({
        userId: mockUserId,
        eventDate: { $lt: expect.any(String) }
      });
      expect(mockSort).toHaveBeenCalledWith({ eventDate: -1 });
      expect(result[0].eventId).toBe("past1");
    });
  
    it("✅ getTicketById - should find by ID", async () => {
      (PurchaseModel.findById as jest.Mock).mockResolvedValue({ _id: "ticket123" });
  
      const result = await getTicketById("ticket123");
  
      expect(PurchaseModel.findById).toHaveBeenCalledWith("ticket123");
      expect(result._id).toBe("ticket123");
    });
  
    it("✅ deleteTicket - should delete ticket with matching userId", async () => {
      (PurchaseModel.findOneAndDelete as jest.Mock).mockResolvedValue({ _id: "ticket123", deleted: true });
  
      const result = await deleteTicket("ticket123", mockUserId);
  
      expect(PurchaseModel.findOneAndDelete).toHaveBeenCalledWith({ _id: "ticket123", userId: mockUserId });
      expect(result.deleted).toBe(true);
    });
  });
  