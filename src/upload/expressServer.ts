import express from 'express'

export class expressServer {
    app: any = express();

    constructor(port: number) {
        this.app.use(express.static('./temp'));

        this.app.listen(port);
    }

    shutdown() {
        this.app.shutdown();
    }
}