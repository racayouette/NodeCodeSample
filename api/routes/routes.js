var Users = require('../controllers/users');
var Admin = require('../controllers/adminContent');
var Post = require('../controllers/post');
_ =require('underscore');
var Joi = require('joi');
var fs = require('fs');

var baseRoutes = {
  register: async function(server, options) {
    var routes = [
      {
          method: 'POST',
          path: '/register',
          options:
          {
              description:"user register",
              notes:'The user',
              tags:['api','register'],
              handler:Users.registerData,
              auth: false,
              payload: {
                  output: 'stream',
                  maxBytes: 2569852146,
                  parse: true,
                  allow: 'multipart/form-data'
              },
              validate:
              {
                payload:
                {
                  name:Joi.string().required().min(3).max(25),
                  description:Joi.string().required().min(3).max(100),
                  image:Joi.object({ pipe: Joi.func() }).unknown().required(),
                  email:Joi.string().required(),
                  device_id:Joi.string().required(),
                  password:Joi.string().required().min(6).max(50),
                  lat:Joi.required(),
                  lon:Joi.required(),
                  device_name:Joi.number().required().min(0).max(1),
                  referral_code:Joi.optional(),
                  phone:Joi.string().required().min(6).max(50)
                },
                failAction : (request, h, err) =>{
                    err.output.payload.response=new Object();
                    if(err) throw err; 
                }
              }
          }
      },
      {
          method: 'GET',
          path: '/image/{type}/{name}',
          options:{
            description:"Image Get API",
            notes:'The user',
            tags:['api','image'],
            handler:Users.imageGet,      
            validate:
            {
              params:
              {
                type:Joi.string().required(),
                name:Joi.string().required()
              },
              failAction : (request, h, err) =>{
                err.output.payload.response=new Object();
                if(err) throw err; 
              }
            }
          }
      },
      {
          method: 'POST',
          path: '/login',
          options:{
            description:"login api",
            notes:'The user',
            tags:['api','login'],
            handler:Users.userLogin,      
            validate:
            {
              payload:
              {
                email:Joi.string().email().required(),
                password:Joi.string().required().min(6).max(50),
                lat:Joi.required(),
                lon:Joi.required()
              },
              failAction : (request, h, err) =>{
                err.output.payload.response=new Object();
                if(err) throw err; 
              }
            }
          }
      },
      {
        method:'POST',
        path:'/add-category',
        options:{
          description:"add categoties into list",
          notes:"the user",
          tags:['api','category'],
          handler:Admin.addCategory,
          validate:
          {
            payload:
            {
              name:Joi.string().required(),
              key:Joi.string().valid('bitchat').required()
            },
            failAction : (request, h, err) =>{

              err.output.payload.response=new Object();
              if(err) throw err; 
            }
          }
        }
      },
      {
        method:'GET',
        path:'/all-category',
        options:{
          description:"all categoties list",
          notes:"the user",
          tags:['api','category'],
          handler:Admin.allCategory,
        }
      },
      {
        method:'POST',
        path:'/upload-post',
        options:{
          description:"upload post",
          notes:"the user",
          tags:['api','upload','post'],
          handler:Post.uploadPost,
          auth: false,
          payload: {
              output: 'stream',
              maxBytes: 2569852146,
              parse: true,
              allow: 'multipart/form-data'
          },
          validate:
          {
            payload:
            {
              user_id:Joi.string().required().min(24).max(24),
              access_key:Joi.required(),
              image:Joi.object({ pipe: Joi.func() }).unknown().required(),
              category:Joi.array().required().min(1),
              caption:Joi.string().optional().min(1).max(200),
              location:Joi.string().required(),
              lat:Joi.required(),
              lon:Joi.required()
            },
            failAction : (request, h, err) =>{
              err.output.payload.response=new Object();
              if(err) throw err; 
            }
          }
        }
      },
      {
        method:'POST',
        path:'/update-post',
        options:{
          description:"update post",
          notes:"the user",
          tags:['api','update','post'],
          handler:Post.updatePost,
          validate:
          {
            payload:
            {
              user_id:Joi.string().required().min(24).max(24),
              access_key:Joi.required(),
              post_id:Joi.string().required().min(24).max(24),
              category:Joi.array().required().min(1),
              caption:Joi.string().optional().min(1).max(200),
              location:Joi.string().required(),
              lat:Joi.required(),
              lon:Joi.required()
            },
            failAction : (request, h, err) =>{
              err.output.payload.response=new Object();
              if(err) throw err; 
            }
          }
        }
      },
      {
        method:'POST',
        path:'/like-unlike',
        options:{
          description:"like unlike uploaded posts",
          notes:"the user",
          tags:['api','unlike','like'],
          handler:Post.likeUnlike,
          validate:
          {
            payload:
            {
              access_key:Joi.string().required(),
              user_id:Joi.string().required().min(24).max(24),
              post_id:Joi.string().required().min(24).max(24)
            },
            failAction : (request, h, err) =>{

              err.output.payload.response=new Object();
              if(err) throw err; 
            }
          }
        }
      },
      {
        method:'POST',
        path:'/post-comment',
        options:{
          description:"comment on uploaded posts",
          notes:"the user",
          tags:['api','comment'],
          handler:Post.commentPost,
          validate:
          {
            payload:
            {
              access_key:Joi.string().required(),
              user_id:Joi.string().required().min(24).max(24),
              post_id:Joi.string().required().min(24).max(24),
              comment:Joi.string().required().min(1).max(200)
            },
            failAction : (request, h, err) =>{

              err.output.payload.response=new Object();
              if(err) throw err; 
            }
          }
        }
      },
      {
        method:'POST',
        path:'/update-comment',
        options:{
          description:"update comment on uploaded posts",
          notes:"the user",
          tags:['api','update','comment'],
          handler:Post.commentUpdate,         
          validate:
          {
            payload:
            {
              access_key:Joi.string().required(),
              user_id:Joi.string().required().min(24).max(24),
              post_id:Joi.string().required().min(24).max(24),
              comment_id:Joi.string().required().min(24).max(24),
              comment:Joi.string().required().min(1).max(200)
            },
            failAction : (request, h, err) =>{

              err.output.payload.response=new Object();
              if(err) throw err; 
            }
          }
        }
      },
      {
        method:'POST',
        path:'/likeUnlike-comment',
        options:{
          description:"update comment on uploaded posts",
          notes:"the user",
          tags:['api','update','comment'],
          handler:Post.commentlikeUnlike,         
          validate:
          {
            payload:
            {
              access_key:Joi.string().required(),
              user_id:Joi.string().required().min(24).max(24),
              post_id:Joi.string().required().min(24).max(24),
              comment_id:Joi.string().required().min(24).max(24),
            },
            failAction : (request, h, err) =>{

              err.output.payload.response=new Object();
              if(err) throw err; 
            }
          }
        }
      },
      {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
        method:'POST',
        path:'/all-comments',
        options:{
          description:"all comment on uploaded posts",
          notes:"the user",
          tags:['api','all','comment'],
          handler:Post.allComment,         
          validate:
          {
            payload:
            {
              access_key:Joi.string().required(),
              user_id:Joi.string().required().min(24).max(24),
              limit:Joi.number().required(),
              offset:Joi.number().required(),
              post_id:Joi.string().required().min(24).max(24)
            },
            failAction : (request, h, err) =>{

              err.output.payload.response=new Object();
              if(err) throw err; 
            }
          }
        }
      },
      {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
        method:'POST',
        path:'/all-likes',
        options:{
          description:"all likes on uploaded posts",
          notes:"the user",
          tags:['api','all','likes'],
          handler:Post.allLikes,         
          validate:
          {
            payload:
            {
              access_key:Joi.string().required(),
              user_id:Joi.string().required().min(24).max(24),
              limit:Joi.number().required(),
              offset:Joi.number().required(),
              post_id:Joi.string().required().min(24).max(24)
            },
            failAction : (request, h, err) =>{

              err.output.payload.response=new Object();
              if(err) throw err; 
            }
          }
        }
      },
      {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
        method:'POST',
        path:'/all-posts',
        options:{
          description:"all uploaded posts",
          notes:"the user",
          tags:['api','all','posts'],
          handler:Post.allPosts,
          validate:
          {
            payload:
            {
              access_key:Joi.string().required(),
              user_id:Joi.string().required().min(24).max(24),
              limit:Joi.number().required(),
              offset:Joi.number().required()
            },
            failAction : (request, h, err) =>{
              err.output.payload.response=new Object();
              if(err) throw err; 
            }
          }
        }
      },
      {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
        method:'POST',
        path:'/follow',
        options:{
          description:"follow user",
          notes:"the user",
          tags:['api','follow'],
          handler:Post.followUser,
          validate:
          {
            payload:
            {
              access_key:Joi.string().required(),
              user_id:Joi.string().required().min(24).max(24),
              follow_id:Joi.string().disallow(Joi.ref('user_id')).required().min(24).max(24)
            },
            failAction : (request, h, err) =>{
              err.output.payload.response=new Object();
              if(err) throw err; 
            }
          }
        }
      },
      {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
        method:'POST',
        path:'/favourite',
        options:{
          description:"favourite Post",
          notes:"the user",
          tags:['api','favourite'],
          handler:Post.favouriteUser,
          validate:
          {
            payload:
            {
              access_key:Joi.string().required(),
              user_id:Joi.string().required().min(24).max(24),
              post_id:Joi.string().required().min(24).max(24)
            },
            failAction : (request, h, err) =>{
              err.output.payload.response=new Object();
              if(err) throw err; 
            }
          }
        }
      },
      {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
        method:'POST',
        path:'/follower-following',
        options:{
          description:"follower following list",
          notes:"the user",
          tags:['api','follower','following'],
          handler:Post.followerFollowingUser,
          validate:
          {
            payload:
            {
              access_key:Joi.string().required(),
              user_id:Joi.string().required().min(24).max(24),
              viewer:Joi.string().required().min(24).max(24),
              limit:Joi.number().required(),
              offset:Joi.number().required(),
              type:Joi.number().required()
            },
            failAction : (request, h, err) =>{
              err.output.payload.response=new Object();
              if(err) throw err; 
            }
          }
        }
      },
      {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
        method:'POST',
        path:'/favourite-list',
        options:{
          description:"favourite list",
          notes:"the user",
          tags:['api','favourite'],
          handler:Post.favouritePosts,
          validate:
          {
            payload:
            {
              access_key:Joi.string().required(),
              user_id:Joi.string().required().min(24).max(24),
              limit:Joi.number().required(),
              offset:Joi.number().required()
            },
            failAction : (request, h, err) =>{
              err.output.payload.response=new Object();
              if(err) throw err; 
            }
          }
        }
      },
      {
          method: 'POST',
          path: '/edit-profile',
          options:
          {
              description:"user profile edit",
              notes:'The user',
              tags:['api','profile','edit'],
              handler:Users.editProfile,
              auth: false,
              payload: {
                  output: 'stream',
                  maxBytes: 2569852146,
                  parse: true,
                  allow: 'multipart/form-data'
              },
              validate:
              {
                payload:
                {
                  access_key:Joi.string().required(),
                  user_id:Joi.string().required().min(24).max(24),
                  name:Joi.string().required().min(3).max(25),
                  description:Joi.string().required().min(3).max(100),
                  image:Joi.object({ pipe: Joi.func() }).unknown(),
                  phone:Joi.string().required().min(6).max(50)
                },
                failAction : (request, h, err) =>{
                    err.output.payload.response=new Object();
                    if(err) throw err; 
                }
              }
          }
      },{
          method: 'POST',
          path: '/user-detail',
          options:
          {
              description:"user detail",
              notes:'The user',
              tags:['api','detail'],
              handler:Users.userDetail,
              validate:
              {
                payload:
                {
                  access_key:Joi.string().required(),
                  user_id:Joi.string().required().min(24).max(24),
                  viewer:Joi.string().required().min(24).max(24),
                  offset:Joi.number().required(),
                  limit:Joi.number().required()
                },
                failAction : (request, h, err) =>{
                    err.output.payload.response=new Object();
                    if(err) throw err; 
                }
              }
          }
      },
      {
          method: 'POST',
          path: '/delete-post',
          options:
          {
              description:"delete post",
              notes:'The user',
              tags:['api','delete','post'],
              handler:Post.deletePost,
              validate:
              {
                payload:
                {
                  access_key:Joi.string().required(),
                  user_id:Joi.string().required().min(24).max(24),
                  post_id:Joi.string().required().min(24).max(24)
                }, 
                failAction : (request, h, err) =>{
                    err.output.payload.response=new Object();
                    if(err) throw err; 
                }
              }
          }
      }

    ]
    server.route(routes)
  },
  name: 'routes',
  version:'1'
};
module.exports=baseRoutes;
