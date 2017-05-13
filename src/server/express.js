import express from "express";
import expressValidation from "express-validation";
import bodyParser from "body-parser";
import compress from "compression";
import cors from "cors";
import helmet from "helmet";
import httpStatus from "http-status";
import responseTime from "response-time";
import i18n from "i18n";

import config from "./config";
import logger, { logHttpRequest } from "./logger";
import routes from "../routes/index";
import APIError, { UnhandledAPIError } from "../helpers/api-error";

i18n.configure({
    locales: ["en"],
    defaultLocale: "en",
    directory: __dirname + "/../../locales"
});

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compress());
app.use(helmet());
app.use(cors({
    origin: config.NODE_ENV === "development" ? "*" : "http://labaleine.netlify.com",
    optionsSuccessStatus: 200
}));

app.use(i18n.init);

app.use(responseTime((req, res, time) => {
    logHttpRequest(req, res, time);
}));

app.use("/", routes);

// if error is not an instanceOf APIError, convert it.
app.use((err, req, res, next) => {
    if (err instanceof expressValidation.ValidationError) {
        const unifiedErrorMessage = err.errors.map(error => error.messages.join(". ")).join(" and ");
        const error = new APIError(unifiedErrorMessage, err.status);
        return next(error);
    }
    else if (!(err instanceof APIError)) {
        const apiError = new UnhandledAPIError(err);
        return next(apiError);
    }
    return next(err);
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new APIError(["%s %s not found", req.method, req.path], httpStatus.NOT_FOUND);
    return next(err);
});

// error handler, send stacktrace only in development.
app.use((err, req, res, next) => {
    let json = { status: httpStatus[err.status] };
    json.message = Array.isArray(err.message) ? req.__(...err.message) : err.message;
    if (config.NODE_ENV === "development" || config.NODE_ENV === "test") {
        json.type = err.type;
        json.stack = err.stack;
    }
    res.status(err.status).json(json);

    if (err instanceof APIError) {
        logger.warn(json);
    }
    else {
        logger.error(json);
    }

    next();
});

export default app;