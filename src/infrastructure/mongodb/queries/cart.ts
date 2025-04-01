import { CartModel } from "../models/cart";

export const createCartItem = async (userId: string, eventData: any) => {
    const newWishlist = new CartModel({ userId, ...eventData });
    return await newWishlist.save();
};

export const getCartByUserId = async (userId: string) => {
    return await CartModel.find({ userId }).sort({ addAt: -1 });
};

export const deleteCartItem = async (userId: string, eventId: string) => {
    return await CartModel.findOneAndDelete({ userId, eventId });
};