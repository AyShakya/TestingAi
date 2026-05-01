require('dotenv').config();

const mongoose = require('mongoose');

const mongoUri = process.env.MONGODB_URI;

async function connectMongo() {
	if (!mongoUri) {
		throw new Error('MONGODB_URI is not defined in the .env file');
	}

	return mongoose.connect(mongoUri);
}

module.exports = { connectMongo, mongoose };