const User=require("../models/user")
module.exports.renderSignupform=(req,res)=>{
    res.render("users/signup.ejs");
}
module.exports.signup=async(req,res)=>{
   
   try{
    const {username,email,password}=req.body;
    const newuser=new User({username,email});
    const registeredUser=await User.register(newuser,password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err) return next(err);
        else{
            req.flash("success","Welcome to wanderlust");
            res.redirect("/listings");
        }
    })
    }
    catch(e){
        req.flash("error",e.message);
         res.redirect("/signup");
    }
}
module.exports.renderLoginform=(req,res)=>{
    res.render("users/login.ejs");
}
module.exports.login=async (req, res) => {
    req.flash("success", "Welcome to Wanderlust, you are logged in!");

    const redirectUrl = res.locals.redirectUrl || "/listings"; // fallback
    res.redirect(redirectUrl);
  }

module.exports.logout=(req,res,next)=>{
   req.logout((err)=>{
    if(err){
        return next(err);
    }
    req.flash("success","logged out");
    res.redirect("/listings");
   });
}