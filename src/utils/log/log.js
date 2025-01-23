const NAMESPACE = "dis-data-admin-ui"; 

const severity = {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3
};

/**
 * Map HTTP values to log specification
 * @param {string} requestID - request UUID
 * @param {string} method - request method - GET/POST, etc.
 * @param {string} path - path of request 
 * @param {number} statusCode - request HTTP status code 
 * @param {Date} startedAt - start time of request 
 * @param {Date} endedAt - end time of request 
 * @return {httpEvent} - object that matches our http logging standards
 */
const mapHTTPEvent = ({method, path, statusCode, startedAt, endedAt}) => {
    // we use "https://www.ons.gov.uk" as a base URL as Javascript's URL API 
    // doesn't support relative URL's. we can't use `document.location` as 
    // logging can also be called from server componeents. 
    // it DOESN'T appear in any logs
    // TODO: we should probably find a better solution
    const url = new URL(path, "https://www.ons.gov.uk");

    let httpEvent = {
        method: method,
        path: url.pathname || null,
        query: url.search || null,
        status_code: statusCode,
        started_at: startedAt,
    };

    if (endedAt) {
        const duration = Date.parse(endedAt) - Date.parse(startedAt);
        httpEvent.ended_at = endedAt;
        httpEvent.duration = duration;
    }

    return httpEvent;
};


/**
 * Map error values to log specification
 * @param {Error} error 
 * @return {string, array} - object containing error message and stack trace in an array
 */
const mapErrorEvent = (error) => {
    let stackTrace = undefined;
    if (error.stack) {
        try {
            const splitStackTrace = error.stack.split("\n");
            stackTrace = splitStackTrace.map(line => {
                return {
                    line: line.trim(),
                };
            });
        } catch (err) {
            console.error(err);
            stackTrace = error.stack;
        }
    }
    return {
        message: error.message,
        stack_trace: stackTrace,
    };
};

/**
 * Represents a log object
 * @param {number} severity - severity of event
 * @param {string} event - the event being logged
 * @param {object} data - optional - to add additional context to log 
 * @param {object} http - optional - to add HTTP values to log
 * @param {Error} error - optional - to add error information to log  
 */
const createLog = (severity, event, data = null, http = null, error = null) => {
    let log = {
        "created_at": new Date().toISOString(),
        "event": event,
        "namespace": NAMESPACE,
        "severity": severity
    };

    if (data) {
        log.data = {...data};
    }

    if (http) {
        const mappedHTTP = mapHTTPEvent({...http});
        log.http = mappedHTTP;
    }

    if (error) {
        const mappedError = mapErrorEvent(error);
        log.errors = mappedError;
    }

    doLog(log);
};

/**
 * Used for messages that confirm that the application is behaving as it should
 * @param {string} event - the event being logged
 * @param {object} data - optional - to add additional context to log 
 * @param {object} http - optional - to add HTTP values to log
 */
const logInfo = (event, data, http) => {
    createLog(severity.info, event, data, http);
};

/**
 * Used to indicates something that may cause a problem
 * @param {string} event - the event being logged
 * @param {object} data - optional - to add additional context to log 
 * @param {object} http - optional - to add HTTP values to log
 * @param {Error} error - optional - to add error information to log  
 */
const logWarn = (event, data, http, error) => {
    createLog(severity.warn, event, data, http, error);
};

/**
 * Used to indicate that a required task failed
 * @param {string} event - the event being logged
 * @param {object} data - optional - to add additional context to log 
 * @param {object} http - optional - to add HTTP values to log
 * @param {Error} error - optional - to add error information to log  
 */
const logError = (event, data, http, error) => {
    createLog(severity.error, event, data, http, error);
};

/**
 * Used to indicate a serious problem that can stop the application from running
 * @param {string} event - the event being logged
 * @param {object} data - optional - to add additional context to log 
 * @param {object} http - optional - to add HTTP values to log
 * @param {Error} error - optional - to add error information to log  
 */
const logFatal = (event, data, http, error) => {
    createLog(severity.fatal, event,  data, http, error);
};

// extract the "doing" logic here - could add log to websocket or stdout in future
const doLog = (log) => {
    console.log(JSON.stringify(log));
};

export { logInfo, logWarn, logError, logFatal };
