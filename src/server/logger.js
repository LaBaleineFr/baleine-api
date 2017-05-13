import bunyan from "bunyan";
import config from "./config";
import httpStatus from "http-status";

const logger = new bunyan.createLogger({
    name: "baleine-api",
    stream: process.stdout,
    level: config.LOG_LEVEL
});

export function logHttpRequest(req, res, time) {
    let log = {
        method: req.method,
        url: req.originalUrl,
        "client-ip": req.headers["x-forwarded-for"] || req.connection.remoteAddress,
        "response-time": Math.trunc(time) + "ms",
        "http-version": req.httpVersion,
        headers: req.headers,
        status: {
            code: res.statusCode,
            message: httpStatus[res.statusCode]
        },
        params: req.params,
        query: req.query,
        body: req.body,
    };

    delete log.headers.authorization;
    delete log.params.password;
    delete log.query.password;
    delete log.body.password;

    if (res.statusCode >= httpStatus.CONTINUE && res.statusCode <= httpStatus.TEMPORARY_REDIRECT) {
        logger.info(log);
    }
    else if (res.statusCode >= httpStatus.BAD_REQUEST && res.statusCode <= httpStatus.UNAVAILABLE_FOR_LEGAL_REASONS) {
        logger.warn(log);
    }
    else {
        logger.error(log);
    }
}

export default logger;