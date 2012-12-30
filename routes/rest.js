var db = require('../models');
function handle(err,doc,req,res,next){
	res.setHeader("Content-Type", "application/json");
	// if (typeof(req.headers['x-requested-with']) == 'undefined' 
	// 		|| req.headers['x-requested-with']  != 'XMLHttpRequest') {
	// 	var err = {
	// 		message: 'XMLHR request refused'
	// 	};
	// }
	if (err) {
		return handleError(err,req,res,next);
	} 
	var object = {
		error: 0,
		method: req.originalMethod
	};
	if (doc > 1)
		object.data = doc + ' docs updated';
	else if (doc == 1)
		object.data = doc + ' doc updated'; 
	else 
		object.data = doc;
	return res.send(object);
}
function handleError(err,req,res,next){
	var object = {
		error: err,
		method: req.originalMethod
	};
	return res.send(object);
}
var methods = {
	test: function(req,res,next){
		db.Users.add({
			name: 'klik 1',
			description: 'klik1 description',
			hidden: false
		}, function(err,doc){
			if (err)
				return res.send(err);
			return res.send(doc);
		});
	},
	settings: {
		methods: 'list',
		/*
		 * Settings Operations
		 */
		list: function(req,res,next){
			db.Settings.get(function(err,doc){
				return handle(err,doc,req,res,next);
			});
		}
	},
	users: {
		methods: 'list,add,get,edit,setVote',
		/*
		 * User Operations
		 */
		list: function(req,res,next){
			db.Users.list(function(err,doc){
				return handle(err,doc,req,res,next);
			});
		},
		add: function(req,res,next){
			var data = req.body;
			db.Users.add(data, function(err,doc){
				return handle(err,doc,req,res,next);
			});
		},
		get: function(req,res,next){
			var id = req.params.id;
			db.Users.get({_id:id},function(err,doc){
				return handle(err,doc,req,res,next);
			});
		},
		edit: function(req,res,next){
			var id = req.params.id;
			var data = req.body;
			db.Users.edit({_id:id}, data, function(err,doc){
				return handle(err,doc,req,res,next);
			});

		},
		setVote: function(req,res,next){
			var data = req.body;
			db.Users.vote({_id:id}, data, function(err,doc){
				return handle(err,doc,req,res,next);
			});
		}
	},
	voters: {
		list: function(req,res,next){
			db.Voters.list(function(err,doc){
				return handle(err,doc,req,res,next);
			});
		},
		add: function(){
			var data = req.body;
			db.Voters.add(data, function(err,doc){
				return handle(err,doc,req,res,next);
			});
		}
	}
}
module.exports = {
	test: function(req,res,next){
		db.Users.vote({_id:'50caa303d17b1db417000002'}, {}, function(err,doc){
			return handle(err,doc,req,res,next);
		});
	},
	run: function(req,res,next){
		if (methods[req.params.collection] === undefined)
			return res.send(404);
		else
			var coll = methods[req.params.collection];
		if (req.params.id === undefined) {
			if (req.method === 'GET') {
				return coll.list(req,res,next);
			}
			if (req.method === 'POST')
				return coll.add(req,res,next);
		} else {
			//action by id
			if (req.method === 'GET') {
				return coll.get(req,res,next);
			} else if (req.method === 'PUT') {
				return coll.edit(req,res,next);
			} else if (req.method === 'DEL') {
				return coll.edit(req,res,next);
			}
		}
	},
	vote: function(req,res,next){
		return methods.users.setVote(req,res,next);
	},
	validate: function(req,res,next){
		//validate stuff
		next();
	}
}