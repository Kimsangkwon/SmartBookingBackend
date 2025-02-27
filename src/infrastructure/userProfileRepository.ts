import UserProfile from "./mongodb/models/userProfile";

export const findUserProfile = async (userId: string) => {
    return await UserProfile.findOne({ userId });
};

export const updateUserProfile = async (userId: string, profileData: any) => {
    let profile = await UserProfile.findOne({ userId });

    if (profile) {
        Object.assign(profile, profileData);
        await profile.save();
        return { message: "Profile updated successfully", profile };
    } else {
        profile = new UserProfile({ userId, ...profileData });
        await profile.save();
        return { message: "Profile created successfully", profile };
    }
};
