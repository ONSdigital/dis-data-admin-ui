import { version } from 'react';

import  { logInfo } from '@/utils/log/log';
import  request from "@/utils/request/request"

export async function GET() {
    const healthcheck = {
        "status": "OK",
        "version": {
            "version": process.env.VERSION ? process.env.VERSION : "",
            "git_commit": process.env.GIT_COMMIT ? process.env.GIT_COMMIT : "",
            "build_time": process.env.BUILD_TIME ? process.env.BUILD_TIME : "",
            "language": "",
            "language_version": ""
        },
        "uptime": (Date.now() - Date.parse(process.env.BUILD_TIME)),
        "start_time": process.env.BUILD_TIME ? process.env.BUILD_TIME : "",
        "checks": []
    }

    const apiRouterHealthResponse = await request(process.env.API_ROUTER_URL + '/health')

    if (apiRouterHealthResponse.status == 'WARNING') {
        healthcheck.status = 'WARNING'
    } else if (apiRouterHealthResponse.status == 'CRITICAL') {
        healthcheck.status = 'CRITICAL'
    }

    healthcheck.checks.push(apiRouterHealthResponse)

    logInfo("Health Check Requested", {healthcheck, version}, null)

    return Response.json(healthcheck)
}
