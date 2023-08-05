import express from 'express';
export class expressServer {
    app = express();
    constructor(port) {
        this.app.use(express.static('./temp'));
        this.app.listen(port);
    }
}
