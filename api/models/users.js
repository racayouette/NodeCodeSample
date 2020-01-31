var mongoose= require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/bitchat',{ useMongoClient: true });

var Schema = mongoose.Schema;

var follower = new Schema({
    user_id: { type: mongoose.Schema.ObjectId, trim: true, default: null, required: true },
    created_at: {type:Date, default: Date.now }
});

var favourite = new Schema({
    post_id: { type: mongoose.Schema.ObjectId, trim: true, default: null, required: true },
    created_at: {type:Date, default: Date.now }
});

var userSchema=new Schema({
    name : { type:String, required: true },
    email : { type:String, required: true },
    description : { type:String, required: true },
    password : { type:String, required: true },
    lat : { type:String, required: true },
    lon : { type:String, required: true },
    device_name : { type:Number, required: true },
    referral_code : { type:String, required: false },
    phone:{type:String, required:true},
    access_key : {type:String, required: true},
    created_at : {type:Date, default: Date.now},
    follow:[follower],
    follower:[follower],
    favourite:[favourite],
    blockuser:[follower],
    status:{type:Boolean, required: true,default:1}
});

module.exports= mongoose.model('User', userSchema);
