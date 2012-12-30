var db = require('../models');

function handle(err,doc){
	if (err)
		return err;
	return doc;
}
module.exports = {
	index: function(req,res,next){
		res.send(req.user.votes);
	},
	create: function(req,res,next){
		var data = req.body;
		data.voterIp = (req.headers['x-forwarded-for']) ? 
			req.headers['x-forwarded-for'] : 
			req.connection.remoteAddress;
		db.Users.vote({_id:req.user._id}, data, function(err,doc){
			if (err)
				return res.send(err);
			io.sockets.emit('updateStats', {user:req.user._id, votes: doc.votes.length});
			return res.send(handle(err,doc));
		});
	}
}