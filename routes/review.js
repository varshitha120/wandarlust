const express=require("express");
const router=express.Router({mergeParams:true});
//mergerparams is to merge the parent objects in child such as if we need listing id it will get from app.js
const {listingSchema,reviewSchema}=require("../schema.js");
const Listing=require("../models/listing.js");
const Review=require("../models/review.js");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {validateReview,isLoggedIn,isreviewAuthor}=require("../middleware.js")
const reviewController=require("../controllers/review.js");



//reviews
//post
router.post("/",isLoggedIn,validateReview,wrapAsync(
  reviewController.createReview
));

//delete review
router.delete("/:reviewId",isLoggedIn,isreviewAuthor,wrapAsync(reviewController.deleteReview));
module.exports = router;
