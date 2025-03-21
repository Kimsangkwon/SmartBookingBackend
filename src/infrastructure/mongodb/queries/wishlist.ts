import { WishlistModel } from "../models/wishlist";

export const createWishlistItem = async (userId: string, eventData: any) => {
    const newWishlist = new WishlistModel({ userId, ...eventData });
    return await newWishlist.save();
};

export const getWishlistByUserId = async (userId: string) => {
    return await WishlistModel.find({ userId }).sort({ addAt: -1 });
};

export const deleteWishlistItem = async (userId: string, eventId: string) => {
    return await WishlistModel.findOneAndDelete({ userId, eventId });
};