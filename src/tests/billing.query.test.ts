import {
    createBillingInfo,
    getBillingInfosByUserId,
    getBillingInfoById,
    updateBillingInfo,
    deleteBillingInfo
  } from "../../src/infrastructure/mongodb/queries/billing";
  
  import { BillingInfoModel } from "../../src/infrastructure/mongodb/models/billing";
  
  // ✅ Mock Mongoose Model
  jest.mock("../../src/infrastructure/mongodb/models/billing");
  
  describe("🧪 Billing Query Functions", () => {
    const mockUserId = "user123";
    const mockBilling = {
      _id: "b1",
      userId: mockUserId,
      nameOnCard: "John Doe",
      cardNumber: "1234567812345678",
      expirationDate: "12/25",
      save: jest.fn().mockResolvedValue("savedBilling")
    };
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it("✅ createBillingInfo should call save and return billing", async () => {
      (BillingInfoModel as any).mockImplementation(() => mockBilling);
  
      const result = await createBillingInfo(mockUserId, {
        nameOnCard: "John Doe",
        cardNumber: "1234567812345678",
        expirationDate: "12/25"
      });
  
      expect(mockBilling.save).toHaveBeenCalled();
      expect(result).toBe("savedBilling");
    });
  
    it("✅ getBillingInfosByUserId should return masked cards", async () => {
      (BillingInfoModel.find as jest.Mock).mockResolvedValue([
        {
          _id: "b1",
          nameOnCard: "John",
          cardNumber: "1234567812345678",
          expirationDate: "12/25"
        }
      ]);
  
      const result = await getBillingInfosByUserId(mockUserId);
  
      expect(BillingInfoModel.find).toHaveBeenCalledWith({ userId: mockUserId });
      expect(result[0].cardNumber).toBe("**** **** **** 5678");
    });
  
    it("✅ getBillingInfoById should call findOne and return billing", async () => {
      (BillingInfoModel.findOne as jest.Mock).mockResolvedValue({ _id: "b1" });
  
      const result = await getBillingInfoById(mockUserId, "b1");
  
      expect(BillingInfoModel.findOne).toHaveBeenCalledWith({ userId: mockUserId, _id: "b1" });
      expect(result).toEqual({ _id: "b1" });
    });
  
    it("✅ updateBillingInfo should call findOneAndUpdate and return updated billing", async () => {
      (BillingInfoModel.findOneAndUpdate as jest.Mock).mockResolvedValue({ _id: "b1", updated: true });
  
      const result = await updateBillingInfo(mockUserId, "b1", { nameOnCard: "New Name" });
  
      expect(BillingInfoModel.findOneAndUpdate).toHaveBeenCalledWith(
        { userId: mockUserId, _id: "b1" },
        { nameOnCard: "New Name" },
        { new: true }
      );
      expect(result).toEqual({ _id: "b1", updated: true });
    });
  
    it("✅ deleteBillingInfo should call findOneAndDelete and return deleted billing", async () => {
      (BillingInfoModel.findOneAndDelete as jest.Mock).mockResolvedValue({ _id: "b1", deleted: true });
  
      const result = await deleteBillingInfo(mockUserId, "b1");
  
      expect(BillingInfoModel.findOneAndDelete).toHaveBeenCalledWith({ userId: mockUserId, _id: "b1" });
      expect(result).toEqual({ _id: "b1", deleted: true });
    });
  });
  