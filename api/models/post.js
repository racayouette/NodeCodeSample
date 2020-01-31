var mongoose= require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/bitchat',{ useMongoClient: true });

var Schema = mongoose.Schema;

var likeSchema = new Schema({
    user_id: { type: mongoose.Schema.ObjectId, trim: true, default: null, required: true },
    created_at: {type:Date, default: Date.now }
});

var commentlikeSchema = new Schema({
    user_id: { type: mongoose.Schema.ObjectId, trim: true, default: null, required: true },
    created_at: {type:Date, default: Date.now }
});

var commentSchema=new Schema({
    user_id : { type:mongoose.Schema.ObjectId, required: true },
    comment : { type:String, required: false },
    created_at : {type:Date, default: Date.now},
    likes:[commentlikeSchema]
});

var userSchema=new Schema({
    user_id : { type:mongoose.Schema.ObjectId, required: true },
    category : { type:[mongoose.Schema.ObjectId], required: false },
    caption : { type:String, required: false ,default:''},
    location : { type:String, required: true },
    lat : { type:String, required: true },
    lon : { type:String, required: true },
    image : { type:String, required: true },
    created_at : {type:Date, default: Date.now},
    comments:[commentSchema],
    likes:[likeSchema]
});

module.exports= mongoose.model('Post', userSchema);