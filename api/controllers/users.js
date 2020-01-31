var User=require('../models/users');
const Post = require('../models/post');
var Boom = require('boom');
var uniqid = require('uniqid');
var Category=require('../models/category');
const fs = require("fs");
const password_hash=require('password_hash');
const ObjectID= require('mongoose').mongo.ObjectID;
module.exports = {
    userLogin : async (request, h) => {
    	var data=await User.findOne({email:request.payload.email}) ;
      
        if(data==null){
                let err= Boom.unauthorized('Email not exists');
                err.output.payload.response = new Object();
                return err;         
        }
        else{
            if(password_hash(request.payload.password).verify(data.password)){
                var person = new Object();
                    
                    person.userdata=await User.findOneAndUpdate({email:request.payload.email},{$set:{ lat:request.payload.lat,lon:request.payload.lon}}, {"fields":{blockuser:0,favourite:0,follower:0,follow:0,password:0,status:0,__v:0}, new: true}) ;
                    person.category=await Category.find({});
                
                     return h.response({ statusCode: 200, error:'', message:'', response:person}).code(200);
            }
            else{
                    let err= Boom.unauthorized('Password not matched');
                    err.output.payload.response = new Object();
                    return err;
            }
        }
    },
    registerData:async (request, h) => {
        var cnt=await User.count({email:request.payload.email});
    	if(cnt>0){
            let err= Boom.unauthorized('Email already exists')
            err.output.payload.response = new Object();
    		return err;
    	}	
    	else{
        var access_key=uniqid();
        var salt=password_hash().salt()
        var data =new User({
         name:request.payload.name,
         email:request.payload.email,
         description:request.payload.description,
         password:password_hash(request.payload.password).hash(salt),
         lat:request.payload.lat,
         lon:request.payload.lon,
         device_name:request.payload.device_name,
         referral_code:request.payload.referral_code,
         phone:request.payload.phone,
         access_key
        });     
        var person = new Object();
        person.userdata=await data.save()
        request.payload["image"].pipe(fs.createWriteStream("./api/upload/user/" + person.userdata._id+'.png'))
        person.category=await Category.find({});

        var dataa = { statusCode: 200, error:'', message:'', response:person };
        return h.response(dataa).code(200);

    	}

    },
    imageGet:async (request, h) =>{
        return h.file('./api/upload/'+request.params.type+'/'+request.params.name).code(200)
    },
    editProfile:async (request, h)=>{
        
            var authenticate=await User.findOne({_id: request.payload.user_id,access_key:request.payload.access_key});
            if(authenticate==null){
                    let err= Boom.unauthorized('Invalid request');
                    err.output.payload.response = new Object();
                    return err;  
            }
            if(request.payload["image"]){
                request.payload["image"].pipe(fs.createWriteStream("./api/upload/user/" + request.payload.user_id+'.png'))
            }   
            var updateData=await User.findOneAndUpdate({_id: request.payload.user_id},{name : request.payload.name,
                description : request.payload.description,
                phone : request.payload.phone},{new:true});
        var data = { statusCode: 200, error:'', message:''};
        return h.response(data).code(200);
    },
    userDetail:async (request, h)=>{
            var authenticate=await User.findOne({_id: request.payload.user_id,access_key:request.payload.access_key});
            if(authenticate==null){
                    let err= Boom.unauthorized('Invalid request');
                    err.output.payload.response = new Object();
                    return err;  
            }


                var posts=await Post.aggregate
                    (
                        [
                        {
                            $match:{user_id:ObjectID(request.payload.viewer)}
                        },
                        {
                               $lookup:
                                   {
                                     from: 'users',
                                     pipeline: [
                                         { $match : { _id:ObjectID(request.payload.user_id) } },
                                         { $project: { favourite: 1, _id: 1,name:1 } }
                                     ],
                                     as: "myData"
                                   }
                            },
                            {
                                '$unwind':'$myData'
                            },
                            {
                               $lookup:
                                   {
                                     from: 'users',
                                     localField: "user_id",
                                     foreignField: "_id",
                                     as: "userData"
                                   }
                            },      
                            {
                                '$unwind':'$userData'
                            },
                               {
                                 $lookup:
                                     {
                                        from: "categories",
                                        localField: "category",
                                        foreignField: "_id",
                                        as: "category"
                                    }
                              },
                              {
                                $project:
                                    {
                                        user_id:1,
                                        access_key:1,
                                        location:1,
                                        category:1,
                                        caption:1,
                                        created_at:1,
                                        likes: {$size : "$likes" },
                                        hasFav : {
                                        $in:[1,{
                                            $setDifference:[
                                            {$map:{
                                                     input:"$myData.favourite",
                                                     as:'favourite',
                                                     in:{$cond:{ if: {$eq: ["$$favourite.post_id" , ObjectID(request.payload.user_id)]},then:1,else:0}}
                                                    }},
                                            [false]]
                                        }]
                                        },
                                        hasLike : {
                                        $in:[1,{
                                            $setDifference:[
                                            {$map:{
                                                     input:"$likes",
                                                     as:'like',
                                                     in:{$cond:{ if: {$eq: ["$$like.user_id" , ObjectID(request.payload.user_id)]},then:1,else:0}}
                                                    }},
                                            [false]]
                                        }]
                                        },
                                        comment:{$size:"$comments"},
                                        postImage: {$concat:["http://13.82.184.244:8080/image/posts/","$image"]},
                                        userData:{name:1,_id:1,image:{$concat:["http://13.82.184.244:8080/image/user/"]}}
                                    }   
                            },
                               {$sort:{created_at:-1}}
                               // ,
                               // { $skip : request.payload.offset },
                               // { $limit : request.payload.limit }   

                        ]
                        
                    );


            var data=await User.aggregate([
                    {
                        $match:{_id:ObjectID(request.payload.viewer)}
                    },
                    {
                     $lookup:
                        {
                            from: "posts",
                            localField: "_id",
                            foreignField: "user_id",
                            as: "posts"
                        }
                    },
                    {
                        $project:
                        {
                            name:1,
                            lat:1,
                            lon:1,
                            phone:1,
                            description:1,
                            follower:{$size:"$follower"},
                            following:{$size:"$follow"},
                            hasFollow:{
                            $in:[1,{
                                $setDifference:[
                                {$map:{
                                         input:"$follow",
                                         as:'follo',
                                         in:{$cond:{ if: {$eq: ["$$follo.user_id" , ObjectID(request.payload.user_id)]},then:1,else:0}}
                                        }},
                                [false]]
                            }]
                            },
                            favourite:{$size:"$favourite"},
                            posts:{$size:"$posts"},
                            image:"http://13.82.184.244:8080/image/user/"
                        }
                    }
                ])
            if(data.length>0){
                var main=data[0];
                main.allPosts=posts;
            }
            else{
                var main=new Object();
            }
           return h.response({ statusCode: 200, error:'', message:'Successfull', userResponse:main}).code(200);

    }
}
