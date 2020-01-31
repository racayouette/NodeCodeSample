var mongoose= require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/bitchat',{ useMongoClient: true });

var Schema = mongoose.Schema;

var likeSchema = new Schema({
    user_id: { type: mongoose.Schema.ObjectId, trim: true, default: null, required: true },
    created_at: {type:Date, default: Date.now }
});

var commentSchema=new Schema({
    user_id : { type:mongoose.Schema.ObjectId, required: true },
    comment : { type:String, required: false },
    post_id : { type:mongoose.Schema.ObjectId, required: false },
    created_at : {type:Date, default: Date.now},
    likes:[likeSchema]
});

module.exports= mongoose.model('Comment', commentSchema);