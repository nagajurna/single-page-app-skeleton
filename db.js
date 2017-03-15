const mongoose = require('mongoose');

//mongoose.connect('mongodb://localhost/gallery');
mongoose.connect(process.env.PROD_MONGODB);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log("Connected correctly to server");
});

module.exports = db;
