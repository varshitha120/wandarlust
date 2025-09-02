const express=require("express");
const router=express.Router();
const {listingSchema,reviewSchema}=require("../schema.js");
const Listing=require("../models/listing.js")
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync=require("../utils/wrapAsync.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const ListingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });

router.route("/")
  //index Route
.get(wrapAsync(ListingController.index))
//create Route
.post(isLoggedIn, upload.single("listing[image]"),validateListing,wrapAsync(ListingController.createListing));

//new Route
router.get("/new",isLoggedIn,ListingController.newform);


//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(ListingController.editform));

router.route("/:id")
//update route
.put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(ListingController.updateListing))
 //show route  
.get(wrapAsync(ListingController.show))
//delete route
.delete(isLoggedIn,isOwner,wrapAsync(ListingController.destroyListing));





 

        
     


module.exports = router;
