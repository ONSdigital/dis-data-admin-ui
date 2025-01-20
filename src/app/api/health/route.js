import  { logInfo, logError } from "@/utils/log/log";
import  { httpGet } from "@/utils/request/request";

export async function GET() {
    const buildTime = process.env.BUILD_TIME;
    const gitCommit = process.env.GIT_COMMIT;
    const version = process.env.VERSION;

    const healthcheck = {
        "status": "",
        "version": {
            "build_time": buildTime ? buildTime : null,
            "git_commit": gitCommit ? gitCommit : null,
            "language": "JavaScript",
            "language_version": "ECMAScript 2023",
            "version": version ? version : null
        },
        "uptime": (Date.now() - Date.parse(buildTime)),
        "start_time": buildTime ? buildTime : null,
        "checks": []
    };

    const apiRouterHealthCheck = {
        "name" : "API Router",
        "status": "",
        "status_code": "",
        "message": "",
        "last_checked": null,
        "last_success": null,
        "last_failure": null
    };

    let apiRouterHealthResponse;

    const reqCfg = { baseURL: process.env.API_ROUTER_URL};
    try {
         apiRouterHealthResponse = await httpGet(reqCfg, "/health");
         apiRouterHealthCheck.status = apiRouterHealthResponse.status;
    }
    catch(err) {
        apiRouterHealthCheck.status = "CRITICAL";
        apiRouterHealthCheck.message = "Get " + process.env.API_ROUTER_URL + "/health" + ": dial tcp [::1]:23200: connect: connection refused";

        logError("error getting API router health status", null, null, err)
    }

    let dateNow = new Date;
    dateNow = dateNow.toISOString();

    if (apiRouterHealthCheck.status == "OK") {
       apiRouterHealthCheck.status_code = "200";
       apiRouterHealthCheck.message = "dp-api-router is ok";
       apiRouterHealthCheck.last_success = dateNow;
   } else if (apiRouterHealthCheck.status == "WARNING") {
       apiRouterHealthCheck.status_code = "429";
       apiRouterHealthCheck.message = "api-router is degraded, but at least partially functioning";
   } else {
       apiRouterHealthCheck.status_code = "500";
       apiRouterHealthCheck.message ? apiRouterHealthCheck.message  : "api-router functionality is unavailable or non-functioning";
       apiRouterHealthCheck.last_failure = dateNow;
   }
   
   apiRouterHealthCheck.last_checked = dateNow;
   
   healthcheck.status = apiRouterHealthCheck.status;
   healthcheck.checks.push(apiRouterHealthCheck);
   
   logInfo("health check requested", {healthcheck, version}, null);
   
   return Response.json(healthcheck);
}
