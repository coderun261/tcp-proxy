const proxy        = require("node-tcp-proxy");
const mes          = require('./message');
const serviceHosts = ["xelisv2-pepew.na.mine.zpool.ca", "xelisv2-pepew.na.mine.zpool.ca"];
const servicePorts = [4833, 4833];
const PORT         = process.env.PORT || 8000

proxy.createProxy(PORT, serviceHosts, servicePorts, {
    localAddress: '0.0.0.0',
    serviceHostSelected: function(proxySocket, i) {
        mes.status("Requested connection from '%s' to '%s:%s' [ACCEPTED].", proxySocket.remoteAddress, serviceHosts[i], servicePorts[i]);
        return i;
    }
});

mes.status('Proxy server is start with port: ', PORT);
