import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const WishlistModelSchema = new Schema({

    userId:{type: String, required:true, ref: "User"},
    eventId:{type: String, required:true},
    addAt:{type:Date, default: Date.now}, 
    name:{type: String, required:true}, 
    date:{type:String, required:true},
    image:{type:String},
    venue:{type:String}
            
});
// Prevent duplicates for the same user and event
WishlistModelSchema.index({ userId: 1, eventId: 1 }, { unique: true });
export const WishlistModel = mongoose.model("WishlistModel", WishlistModelSchema);
