import { Server } from './tomp/Server.mjs';
import { readFileSync } from 'fs';
import https from 'https';
import nodeStatic from 'node-static';


const bare =  new Server('/bare/', '');
const serve = new nodeStatic.Server('static/');

const server = https.createServer({
    key: readFileSync('ssl/default.key', 'utf-8'),
    cert: readFileSync('ssl/default.cert', 'utf-8')
});

server.on('request', (request, response) => {
    if (bare.route_request(request, response)) return true;
    serve.serve(request, response);
});

server.on('upgrade', (req, socket, head) => {
	if(bare.route_upgrade(req, socket, head))return;
	socket.end();
});

server.listen(443);