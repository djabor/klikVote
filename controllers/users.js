var db = require('../models');

// Object.prototype.clone = function() {
//   var newObj = (this instanceof Array) ? [] : {};
//   for (i in this) {
//     if (i == 'clone') continue;
//     if (this[i] && typeof this[i] == "object") {
//       newObj[i] = this[i].clone();
//     } else newObj[i] = this[i]
//   } return newObj;
// };
console.log(Object);

function handle(err,doc){
	if (err)
		return err;
	return doc;
}
module.exports = {
	/*
	 * User Operations
	 */
	load: function(req, id, fn) {
		db.Users.get({_id:id},function(err,doc){
			if (doc) {
				fn(null, doc);
			} else {
				switch (req.params.format) {
					case 'json':
						req.res.json({'error' : 'User Not Found'}, 404);
						break;
					case 'html':
					default:
						req.res.send(404);
				}
			}
  		});
	},
	index: function(req,res,next){
		db.Users.list(function(err,doc){
			var ndoc = JSON.parse(JSON.stringify(doc));
			for(var i = 0; i<ndoc.length;i++) {
			 	ndoc[i]['votes'] = ndoc[i]['votes'].length;
			}
			return res.send(handle(err,ndoc));
		});
	},
	create: function(req,res,next){
		var data = req.body;
		db.Users.add(data, function(err,doc){
			return res.send(handle(err,doc));
		});
	},
	show: function(req,res,next){
		return res.send(req.user);
	},
	update: function(req,res,next){
		var id = req.params.id;
		var data = req.body;
		db.Users.edit({_id:id}, data, function(err,doc){
			return res.send(handle(err,doc));
		});
	}
}