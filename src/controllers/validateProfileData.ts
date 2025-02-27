export const validateProfileData = (data: any) => {
    const { firstName, lastName, uniqueDisplayName, phoneNumber, country, province, city, address1, birthdate } = data;

    if (!firstName || firstName.length < 2) return { error: "First name must be at least 2 characters" };
    if (!lastName || lastName.length < 2) return { error: "Last name must be at least 2 characters" };
    if (!uniqueDisplayName || uniqueDisplayName.length < 2) return { error: "Display name must be at least 2 characters" };
    if (!phoneNumber || !/^\d{10}$/.test(phoneNumber)) return { error: "Phone number must be exactly 10 digits" };
    if (!country || country.length < 2) return { error: "Country must be at least 2 characters" };
    if (!province || province.length < 2) return { error: "Province must be at least 2 characters" };
    if (!city || city.length < 2) return { error: "City must be at least 2 characters" };
    if (!address1 || address1.length < 2) return { error: "Address1 must be at least 2 characters" };
    if (!birthdate) return { error: "Birth date is required" };

    return null;
};
