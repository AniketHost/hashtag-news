const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserImageSchema = new Schema({
    
    userImage:{
        type:String,
        required:true,

    },
   


    
    
},{timestamps:true});


const UserImage = mongoose.model("import",UserImageSchema);
module.exports = UserImage;