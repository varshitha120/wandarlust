const Listing=require("../models/listing");
module.exports.index=async(req,res)=>{
    let allistings=await Listing.find();
    res.render("listings/index.ejs",{allistings});
}
module.exports.newform=(req,res)=>{
        res.render("listings/new.ejs")}
module.exports.show=async(req,res)=>{
            let {id}=req.params;
            const listing=await Listing.findById(id).populate({
                path:"reviews",
            populate:{
                path:"author",
            }}).populate("owner");
            if(!listing){
                req.flash("error","Listing you requested does not exist");
                 return res.redirect("/listings");
            }
            
            res.render("listings/show.ejs",{listing});
  }
module.exports.createListing = async (req, res, next) => {
    let url = "";
    let filename = "";
    if (req.file) {
        url = req.file.path;
        filename = req.file.filename;
    }

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();

    req.flash("success", "New listing Created");
    console.log(newListing);
    res.redirect("/listings");
};

module.exports.editform=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested does not exist");
       return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url.replace("/upload", "/upload/w_100");
    res.render("listings/edit.ejs",{listing, originalImageUrl});
}
module.exports.updateListing = async (req, res) => {
    const { id } = req.params;

    // Safeguard
    if (!req.body.listing) {
        req.flash("error", "Invalid form data");
        return res.redirect(`/listings/${id}/edit`);
    }

    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (req.file) {
        const url = req.file.path;
        const filename = req.file.filename;
        listing.image = { url, filename };
    }

    await listing.save();
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted");
    res.redirect("/listings");
    
}