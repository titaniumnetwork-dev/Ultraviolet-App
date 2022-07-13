import createServer from '@tomphttp/bare-server-node';
import http from 'http';
import nodeStatic from 'node-static';


const bare =  createServer('/bare/');
const serve = new nodeStatic.Server('static/');

const server = http.createServer();

server.on('request', (req, res) => {
    if (bare.shouldRoute(req)) {
		bare.routeRequest(req, res);
	} else {
		serve.serve(req, res);
	}
});

server.on('upgrade', (req, socket, head) => {
	if (bare.shouldRoute(req, socket, head)) {
		bare.routeUpgrade(req, socket, head);
	}else{
		socket.end();
	}
});

server.listen({
	port: process.env.PORT || 8080,
});
