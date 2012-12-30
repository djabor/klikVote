var db = require('../models');

function handle(err,doc){
	if (err)
		return err;
	return doc;
}
module.exports = {
	load: function(req, id, fn) {
		db.Voters.get({_id:id},function(err,doc){
			console.log(doc);
			if (doc) {
				fn(null, doc);
			} else {
				switch (req.params.format) {
					case 'json':
						req.res.json({'error' : 'voter Not Found'}, 404);
						break;
					case 'html':
					default:
						req.res.send(404);
				}
			}
  		});
	},
	index: function(req,res,next){
		db.Voters.list(function(err,doc){
			return res.send(handle(err,doc));
		});
	},
	show: function(req,res,next){
		return res.send(req.voter);
	},
	create: function(req,res,next){
		var data = req.body;
		db.Voters.add(data, function(err,doc){
			return res.send(handle(err,doc));
		});
	},
	update: function(req,res,next){
		var data = req.body;
		db.Voters.edit(req.voter._id, data, function(err,doc){
			return res.send(handle(err,doc));
		});
	}
}