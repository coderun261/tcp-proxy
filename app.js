// const proxy        = require("node-tcp-proxy");
// const mes          = require('./message');
// const serviceHosts = ["xelisv2-pepew.na.mine.zpool.ca", "xelisv2-pepew.na.mine.zpool.ca"];
// const servicePorts = [4833, 4833];
// const PORT         = process.env.PORT || 8000

// proxy.createProxy(PORT, serviceHosts, servicePorts, {
//     localAddress: '0.0.0.0',
//     serviceHostSelected: function(proxySocket, i) {
//         mes.status("Requested connection from '%s' to '%s:%s' [ACCEPTED].", proxySocket.remoteAddress, serviceHosts[i], servicePorts[i]);
//         return i;
//     }
// });

// console.log('Proxy server is start with port: ', PORT);

const net = require('net');
const PROXY_PORT = 8000; // Local proxy port
const TARGET_HOST = "xelisv2-pepew.na.mine.zpool.ca";
const TARGET_PORT = 4833;

const server = net.createServer((clientSocket) => {
    console.log('Client connected');

    // Connect to the target server
    const targetSocket = net.connect(TARGET_PORT, TARGET_HOST, () => {
        console.log('Connected to target server');
    });

    // Forward data between client and server
    clientSocket.on('data', (data) => {
        // console.log('Client:', data.toString('utf8'));
        targetSocket.write(data);
    });

    targetSocket.on('data', (data) => {
        // console.log('Server:', data.toString('utf8'));
        clientSocket.write(data);
    });

    // Handle socket errors and closures
    clientSocket.on('error', (err) => console.error('Client error:', err));
    targetSocket.on('error', (err) => console.error('Server error:', err));

    clientSocket.on('close', () => {
        console.log('Client disconnected');
        targetSocket.end();
    });

    targetSocket.on('close', () => {
        console.log('Server disconnected');
        clientSocket.end();
    });
});

// Start the proxy
server.listen(PROXY_PORT, () => {
    console.log(`TCP Proxy listening on port ${PROXY_PORT}`);
});
