
# 🛡️ Guardian Incident Postmortem: INC-1387
**Status:** RESOLVED (Automated Pipeline)

## 🚨 Incident Summary
- **Service:** checkout-service
- **Severity:** P2

## 🔍 Root Cause Analysis
AI triage analysis completed.

## 🛠️ Applied Code Fix
**File:** `server.js`
**Reasoning:** The health check endpoint should attempt to reconnect to the database if the connection is lost. The original code only checked the connection status without attempting a reconnection. I have updated the /health endpoint to attempt a reconnection if the database is disconnected. A variable `dbStatus` replaced the conditional check inside json payload. Added try-catch block when attempting the mongo connection.
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

app.get('/health', (req, res) => {
	let dbStatus = 'disconnected';
	if (mongoose.connection.readyState === 1) {
		dbStatus = 'connected';
	}
	else{
		console.error('Database connection is not ready.  Attempting to reconnect.');
		// Attempt to reconnect to MongoDB
		connectMongo().catch(err => {
			console.error('Failed to reconnect to MongoDB:', err);
		});
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
- **PR Created At:** 2026-05-01T16:35:01.784Z
    