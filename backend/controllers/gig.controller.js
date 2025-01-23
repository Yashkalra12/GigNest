import Gig from "../models/gig.model.js";

export const createGig = async (req, res, next) => {
  if (!req.isSeller)
    return next(
      res.status(403).json({ message: "Only sellers can create gigs" })
    );

  const newGig = new Gig({
    userId: req.userId,
    ...req.body,
  });

  try {
    const savedGig = await newGig.save();
    res.status(201).json(savedGig);
  } catch (err) {
    next(err);
  }
};

export const deleteGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) {
      return res.status(404).json({ message: "Gig already deleted/not found" });
    }

    if(gig.userId !== req.userId){
      return res.status(403).json({message: "You can delete only your gigs"})
    }

    await Gig.findByIdAndDelete(req.params.id);
    res.status(200).json({message: "Gig has been deleted successfully!"});


  } catch (err) {
    next(err);
  }
};
export const getGig = async (req, res, next) => {
    try {
        const gig = await Gig.findById(req.params.id);

        if(!gig) return res.status(404).json({message: "Gig not found"});
        res.status(200).json(gig);
        
    } catch (err) {
        next(err);
        
    }
};
export const getGigs = async (req, res, next) => {
    const q=req.query
     // Decode URI component for category
     if (q.category) {
      q.category =decodeURIComponent( req.url.split('=')[1].split('&min')[0]);
  }

    const filters = {
        ...(q.userId && {userId:q.userId}),

        ...(q.category && {category:q.category}),
        ...((q.min || q.max) && {price: { $gte: q.min || 0, $lte: q.max || 9999999}}),
        ...(q.search && {title:{ $regex: q.search , $options: "i"}})
    }
    try {
        const sortOrder = q.sort === 'price' ? 1 : -1;  
        const gigs = await Gig.find(filters).sort({[q.sort]: sortOrder});
        res.status(200).json(gigs);
        
    } catch (err) {
        res.status(500).json({message: "Something went wrong", error: err.message});
        next(err);
        
    }
};

export const getTopGigs = async (req, res, next) => {
  try {
      const gigs = await Gig.find({}).sort({sales: -1}).limit(10);
      res.status(200).json(gigs);
  } catch (err) {
      res.status(500).json({message: "Something went wrong", error: err.message});
      next(err);
  }
};

export const editGig = async (req, res, next) => {
  if (!req.isSeller)
    return next(
      res.status(403).json({ message: "Only sellers can edit gigs" })
    );

  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    if (gig.userId !== req.userId) {
      return res.status(403).json({ message: "You can only edit your own gigs" });
    }

    const updatedGig = await Gig.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json({updatedGig, message: "Gig updated successfully!"});
  } catch (err) {
    next(err);
  }
};
