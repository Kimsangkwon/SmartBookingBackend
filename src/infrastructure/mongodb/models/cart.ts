import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const CartModelSchema = new Schema({

    userId:{type: String, required:true, ref: "User"},
    eventId:{type: String, required:true},
    addAt:{type:Date, default: Date.now}, 
    name:{type: String, required:true}, 
    date:{type:String, required:true},
    image:{type:String},
    venue:{type:String}
            
});
// Prevent duplicates for the same user and event
CartModelSchema.index({ userId: 1, eventId: 1 }, { unique: true });
export const CartModel = mongoose.model("CartModel", CartModelSchema);
