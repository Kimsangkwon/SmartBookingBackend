import { CartModel } from "../models/cart";

export const createCartItem = async (userId: string, eventData: any) => {
    const existing = await CartModel.findOne({ userId, eventId: eventData.eventId });

    if (existing) {
        return { alreadyExists: true, cart: existing };
    }
    const newCart = new CartModel({ userId, ...eventData });
    return { alreadyExists: true, cart: existing };
};

export const getCartByUserId = async (userId: string) => {
    return await CartModel.find({ userId }).sort({ addAt: -1 });
};

export const deleteCartItem = async (userId: string, eventId: string) => {
    return await CartModel.findOneAndDelete({ userId, eventId });
};