var Category=require('../models/category');

module.exports = {
	addCategory : async (request, h) => {
			var data=new Category({
				name:request.payload.name
			})
			var save=await data.save();
	
            return h.response({ statusCode: 200, error:'', message:'Successfull', response:save }).code(200);
			
	},
	allCategory: async (request, h) => {
			var data=await Category.find({});

			return h.response({ statusCode: 200, error:'', message:'Successfull', response:data }).code(200);

	}
}