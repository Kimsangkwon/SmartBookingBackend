import { ReviewModel } from "../models/review";

export const createReview = async (reviewData: any) => {
  const review = new ReviewModel(reviewData);
  return await review.save();
};

export const getApprovedReviewsByEventId = async (eventId: string) => {
  return await ReviewModel.find({ eventId, approved: true }).sort({ createdAt: -1 });
};

export const updateReviewById = async (reviewId: string, userId: string, update: any) => {
  const review = await ReviewModel.findOneAndUpdate(
    { _id: reviewId, userId },
    { ...update, approved: false }, // need approval again after update
    { new: true }
  );
  return review;
};

export const deleteReviewById = async (reviewId: string, userId: string) => {
  const result = await ReviewModel.findOneAndDelete({ _id: reviewId, userId });
  return result;
};

//Get all pending reviews
export const getPendingReviews = async () => {
  return await ReviewModel.find({ approved: false }).sort({ createdAt: -1 });
};

//Get all approved reviews
export const getAppApprovedReviews = async()=>{
  return await ReviewModel.find({approved:true}).sort({createdAt:-1});
}

// Approve a review by admin
export const approveReviewById = async (reviewId: string) => {
  return await ReviewModel.findByIdAndUpdate(
    reviewId,
    { approved: true },
    { new: true }
  );
};

// Decline a review by admin
export const declineReviewById = async (reviewId: string) => {
  return await ReviewModel.findByIdAndDelete(reviewId);
};