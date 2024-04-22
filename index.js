require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT||2000;
const ConnectToMongo = require('./db');
var cors = require('cors');

// const allowedOrigins = ['http://localhost:3000', 'https://menumarket.netlify.app'];
// const corsOptions = {
//     origin: function (origin, callback) {
//         if (!origin || allowedOrigins.includes(origin)) {
//             callback(null, true);
//         } else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     }
// };
// app.use(cors(corsOptions));
app.use(cors({
    origin: ['http://172.16.21.140:3000','http://localhost:3000', 'https://menumarket.netlify.app' ],
    credentials: true,
}));
// app.use(cors({
//     origin: ['http://localhost:3000', 'https://menumarket.netlify.app'],
//     credentials: true,
// }));

// Handle preflight OPTIONS requests
app.use(cors());

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
