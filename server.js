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

app.get('/health', (req, res) => {
	res.json({
		status: 'ok',
		database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
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
		console.error('Failed to connect to MongoDB:', error.message);
		process.exit(1);
	}
}

if (require.main === module) {
	startServer();
}

module.exports = { app, startServer };