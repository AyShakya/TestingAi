
# 🛡️ Guardian Incident Postmortem: INC-8458
**Status:** RESOLVED (Automated Pipeline)

## 🚨 Incident Summary
- **Service:** checkout-service
- **Severity:** P2

## 🔍 Root Cause Analysis
AI triage analysis completed.

## 🛠️ Applied Code Fix
**File:** `server.js`
**Reasoning:** The error message in the catch block was only displaying 'error.message', which might not provide complete debugging information. Changed the error logging to output the entire error object ('error') so that all details of the error, including the stack trace, are displayed, making debugging easier.
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
- **PR Created At:** 2026-05-01T16:25:14.207Z
    