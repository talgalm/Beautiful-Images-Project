const http = require('http');
const cors = require('cors');

const express = require('express');
const app = express();

app.use(cors());

app.post('/', (req, res) => {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        console.log(body);
        res.end('ok');
    });
});

app.listen(3001, () => {
    console.log('Server is listening on port 3001');
});