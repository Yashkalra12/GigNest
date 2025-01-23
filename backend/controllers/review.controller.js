import Review from "../models/review.model.js";
import Gig from "../models/gig.model.js";
export const createReview = async (req, res,next) => {
    try {
        if(req.isSeller) return res.status(403).json({message: "Only Clients can review Gigs"})

        const newReview = new Review({
            userId:req.userId,
            ...req.body
        })
        const savedReview = await newReview.save();
        await Gig.findByIdAndUpdate(req.body.gigId, {
            $inc: { totalStar: req.body.star, starNumber: 1 },
          });
        res.status(201).json(savedReview);
        
    } catch (error) {
        console.log(error)
        next(error)
        
    }

}

export const getReviews = async (req, res,next) => {
    try {
        const reviews = await Review.find({gigId:req.params.gigId}).sort({createdAt:-1});
        res.status(200).json(reviews);
        
    } catch (error) {
        console.log(error)
        next(error)
        
    }
    
}

export const deleteReview = async (req, res,next) => {
    
}
