require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT||2000;
const ConnectToMongo = require('./db');
var cors = require('cors');


app.use(cors({
    origin: 'https://menumarket.netlify.app/',
    credentials: true,
}));
ConnectToMongo();


// Middleware to handle JSON payloads
app.use(express.json({ limit: '50mb' })); // Adjust '50mb' according to your requirements
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth.js'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api', require('./routes/otp'));



// Error handling middleware
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        // Log the error for debugging
        console.error(err);
        // Respond with an error message
        return res.status(400).json({ error: 'Invalid JSON payload' });
    }
    next();
});

// Start the server
app.listen(port, () => {
    console.log(`Project backend on port ${port}`);
});
