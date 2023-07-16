const mongoose =  require("mongoose")

const Schema = mongoose.Schema({
  
    firstname: {type:String,required:true},
    lastname:String,
    email: {type:String,required:true},
   department:{type:String,required:true},
   salary:{type:Number,required:true},
   
})

const Model =  mongoose.model("Dashboard", Schema)
 module.exports = Model