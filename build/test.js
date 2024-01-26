import getPort from "get-port";
import { expressServer } from "./upload/expressServer.js";
import localtunnel from "localtunnel";
const port = await getPort();
const server = new expressServer(port);
const tunnel = await localtunnel({ port });
const url = tunnel.url;
console.log(url);
