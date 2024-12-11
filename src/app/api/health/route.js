import { version } from 'react';

import  { logInfo } from '@/utils/log/log';
import  request from "@/utils/request/request"

export async function GET() {
    const healthcheck = {
        "status": "",
        "version": {
            "build_time": process.env.BUILD_TIME ? process.env.BUILD_TIME : "",
            "git_commit": process.env.GIT_COMMIT ? process.env.GIT_COMMIT : "",
            "language": "JavaScript",
            "language_version": "ECMAScript 2023",
            "version": process.env.VERSION ? process.env.VERSION : ""
        },
        "uptime": (Date.now() - Date.parse(process.env.BUILD_TIME)),
        "start_time": process.env.BUILD_TIME ? process.env.BUILD_TIME : "",
        "checks": []
    }

    const apiRouterHealthCheck = {
        "name" : "API Router",
        "status": "",
        "status_code": "",
        "message": "",
        "last_checked": null,
        "last_success": null,
        "last_failure": null
    }

    let apiRouterHealthResponse

    try {
         apiRouterHealthResponse = await request(process.env.API_ROUTER_URL + '/health')
         apiRouterHealthCheck.status = apiRouterHealthResponse.status
    }
    catch(err) {
        apiRouterHealthCheck.status = 'CRITICAL'
        apiRouterHealthCheck.message = "Get " + process.env.API_ROUTER_URL + '/health' + ": dial tcp [::1]:23200: connect: connection refused"
    }

    if (apiRouterHealthCheck.status == 'OK') {
       apiRouterHealthCheck.status_code = '200'
       apiRouterHealthCheck.message = 'dp-api-router is ok'
       apiRouterHealthCheck.last_checked = new Date().toISOString()
       apiRouterHealthCheck.last_success = new Date().toISOString()
   } else if (apiRouterHealthCheck.status == 'WARNING') {
       apiRouterHealthCheck.status_code = '429'
       apiRouterHealthCheck.message = 'api-router is degraded, but at least partially functioning'
       apiRouterHealthCheck.last_checked = new Date().toISOString()
   } else {
       apiRouterHealthCheck.status_code = '500'
       apiRouterHealthCheck.message ? apiRouterHealthCheck.message  : 'api-router functionality is unavailable or non-functioning'
       apiRouterHealthCheck.last_checked = new Date().toISOString()
       apiRouterHealthCheck.last_failure = new Date().toISOString()
   }

    healthcheck.status = apiRouterHealthCheck.status

    healthcheck.checks.push(apiRouterHealthCheck)

    logInfo("Health Check Requested", {healthcheck, version}, null)

    return Response.json(healthcheck)
}
