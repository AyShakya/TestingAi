require('dotenv').config();

const express = require('express');
const { connectMongo, mongoose } = require('./mongoDb');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
	res.json({
		message: 'Express server is running',
		database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
	});
});

app.get('/health', async (req, res) => {
	let dbStatus = 'disconnected';
	try {
		if (mongoose.connection.readyState === 1) {
			dbStatus = 'connected';
		}
		else{
			console.error('Database connection is not ready.');
			await connectMongo();
			if (mongoose.connection.readyState === 1) {
						dbStatus = 'connected';
				}
		}
	} catch (error) {
		console.error('Failed to reconnect to MongoDB:', error);
		dbStatus = 'error';
	}
	res.json({
		status: 'ok',
		database: dbStatus,
	});
});

async function startServer() {
		try {
			await connectMongo();
			app.listen(port, () => {
				console.log(`Server running on port ${port}`);
				console.log('Connected to MongoDB');
			});
		} catch (error) {
			console.error('Failed to connect to MongoDB:', error);
			process.exit(1);
		}
}

if (require.main === module) {
	startServer();
}

module.exports = { app, startServer };