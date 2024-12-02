import { version } from 'react';

import  { logInfo } from '@/utils/log/log';
import  request from "@/utils/request/request"

export async function GET() {
    const healthcheck = {
        "status": "OK",
        "version": {
            "version": process.env.Version ? process.env.Version : "",
            "git_commit": process.env.GitCommit ? process.env.GitCommit : "",
            "build_time": process.env.BuildTime ? process.env.BuildTime : "",
            "language": "",
            "language_version": ""
        },
        "uptime": (Date.now() - Date.parse(process.env.BuildTime)),
        "start_time": process.env.BuildTime ? process.env.BuildTime : "",
        "checks": []
    }

    const apiRouterHealthResponse = await request(process.env.apiRouterURL + '/health')

    if (apiRouterHealthResponse.status == 'WARNING') {
        healthcheck.status = 'WARNING'
    } else if (apiRouterHealthResponse.status == 'CRITICAL') {
        healthcheck.status = 'CRITICAL'
    }

    healthcheck.checks.push(apiRouterHealthResponse)

    logInfo("Health Check Requested", {healthcheck, version}, null)

    return Response.json(healthcheck)
}
