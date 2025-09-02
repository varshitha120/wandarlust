const mongoose = require("mongoose");
const Listing=require("../models/listing.js");
const initdata=require("./data.js");
async function main() {
   mongoose.connect('mongodb://127.0.0.1:27017/wandarlust');
}
main().then(()=>{
    console.log("connected succesfully");
}).catch(err=>console.log(err));
const intidb=async()=>{
    await Listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({
      ...obj,owner:"68752d1c0beb503069fa0b0e"
    }));
    await Listing.insertMany(initdata.data);
    console.log("data inserted");
};
intidb();