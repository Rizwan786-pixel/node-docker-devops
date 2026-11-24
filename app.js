
const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Home route
app.get('/', (req, res) => {
    res.send('Hello, world!');
});

// Protected secret route
app.get('/secret', (req, res) => {

    res.set('WWW-Authenticate', 'Basic realm="Secret Area"');

    const auth = req.headers.authorization;

    if (!auth || !auth.startsWith('Basic ')) {
        return res.status(401).send('Authentication required');
    }

    const credentials = Buffer
        .from(auth.split(' ')[1], 'base64')
        .toString();

    const separator = credentials.indexOf(':');

    const username = credentials.substring(0, separator);
    const password = credentials.substring(separator + 1);

    if (
        username !== process.env.USERNAME ||
        password !== process.env.PASSWORD
    ) {
        return res.status(401).send('Invalid username or password');
    }

    res.send(process.env.SECRET_MESSAGE);
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});

