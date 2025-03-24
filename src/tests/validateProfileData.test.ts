import { validateProfileData } from "../controllers/validateProfileData";

describe("📋 validateProfileData", () => {
  const validData = {
    firstName: "John",
    lastName: "Doe",
    uniqueDisplayName: "johndoe123",
    phoneNumber: "1234567890",
    country: "Canada",
    province: "Ontario",
    city: "Toronto",
    address1: "123 Main St",
    birthdate: "2000-01-01",
  };

  it("✅ should return null for valid profile data", () => {
    const result = validateProfileData(validData);
    expect(result).toBeNull();
  });

  it("❌ should reject missing first name", () => {
    const data = { ...validData, firstName: "" };
    const result = validateProfileData(data);
    expect(result).toEqual({ error: "First name must be at least 2 characters" });
  });

  it("❌ should reject short last name", () => {
    const data = { ...validData, lastName: "L" };
    const result = validateProfileData(data);
    expect(result).toEqual({ error: "Last name must be at least 2 characters" });
  });

  it("❌ should reject short display name", () => {
    const data = { ...validData, uniqueDisplayName: "a" };
    const result = validateProfileData(data);
    expect(result).toEqual({ error: "Display name must be at least 2 characters" });
  });

  it("❌ should reject invalid phone number (too short)", () => {
    const data = { ...validData, phoneNumber: "12345" };
    const result = validateProfileData(data);
    expect(result).toEqual({ error: "Phone number must be exactly 10 digits" });
  });

  it("❌ should reject phone number with letters", () => {
    const data = { ...validData, phoneNumber: "1234abcd90" };
    const result = validateProfileData(data);
    expect(result).toEqual({ error: "Phone number must be exactly 10 digits" });
  });

  it("❌ should reject short country", () => {
    const data = { ...validData, country: "C" };
    const result = validateProfileData(data);
    expect(result).toEqual({ error: "Country must be at least 2 characters" });
  });

  it("❌ should reject short province", () => {
    const data = { ...validData, province: "O" };
    const result = validateProfileData(data);
    expect(result).toEqual({ error: "Province must be at least 2 characters" });
  });

  it("❌ should reject short city name", () => {
    const data = { ...validData, city: "T" };
    const result = validateProfileData(data);
    expect(result).toEqual({ error: "City must be at least 2 characters" });
  });

  it("❌ should reject short address1", () => {
    const data = { ...validData, address1: "" };
    const result = validateProfileData(data);
    expect(result).toEqual({ error: "Address1 must be at least 2 characters" });
  });

  it("❌ should reject missing birthdate", () => {
    const data = { ...validData, birthdate: "" };
    const result = validateProfileData(data);
    expect(result).toEqual({ error: "Birth date is required" });
  });
});
