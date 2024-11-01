const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const WebSocket = require('ws');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();


app.prepare().then(() => {
    const server = createServer((req, res) => {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
    });

    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
        console.log('New client connected');

        ws.on('message', (message) => {
            console.log(`Received message: ${message}`);
            ws.send(`Server: ${message}`);
        });

        ws.on('error', console.error);

        ws.on('close', () => {
            console.log('Client disconnected');
        });
    });

    const bindAddr = process.env.BIND_ADDR || 3000;
    server.listen(bindAddr, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${bindAddr} || http://127.0.0.1:${bindAddr}`);
    });
});