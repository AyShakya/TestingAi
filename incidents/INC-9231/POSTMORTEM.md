
# 🛡️ Guardian Incident Postmortem: INC-9231
**Status:** RESOLVED (Automated Pipeline)

## 🚨 Incident Summary
- **Service:** checkout-service
- **Severity:** P1

## 🔍 Root Cause Analysis
ECONNREFUSED 127.0.0.1:27017

## 🛠️ Applied Code Fix
**File:** `server.js`
**Reasoning:** The original code attempts to reconnect to MongoDB in the /health endpoint, but it does not await the connectMongo() call. This means that the health check might return 'disconnected' even if the reconnection succeeds shortly after. The fix makes the /health endpoint async and awaits the connectMongo() call. Also, it double checks the connection status after reconnecting.
**Status:** ✅ Applied

```
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
```

## ✅ Audit Trail
- **Approver:** _shamky
- **Decision:** ACCEPTED
- **PR Created At:** 2026-05-01T16:47:55.210Z
    