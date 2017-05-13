import { isAlive as isMongoAlive } from "./server/mongo";
import config from "./server/config";
import app from "./server/express";
import logger from "./server/logger";

function startExpress() {
    if (!module.parent) {
        app.listen(config.API_PORT, () => {
            logger.info("Express start on " + config.API_URL + ":" + config.API_PORT);
        });
    }
}

export const ready = Promise.all([
    isMongoAlive()
]).then(() => {
    logger.info("DB connections are alive");
    startExpress();
}).catch(err => {
    logger.error(err);
    process.exit(1);
});


export default app;