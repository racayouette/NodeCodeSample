var mongoose= require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/bitchat',{ useMongoClient: true });

var Schema = mongoose.Schema;

var userSchema=new Schema({
    name : { type:String, required: true }
});

module.exports= mongoose.model('Category', userSchema);