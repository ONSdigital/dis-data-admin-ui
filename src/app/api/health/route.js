import { logInfo } from '@/utils/log/log';
import { version } from 'react';

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

    let apiRouterHealthResponse = await fetch(process.env.APIROUTERURL)
    let apiRouterHealthCheck = await apiRouterHealthResponse.json()
    
    if (apiRouterHealthCheck.status == 'WARNING') {
        healthcheck.status = 'WARNING'
    } else if (apiRouterHealthCheck.status == 'CRITICAL') {
        healthcheck.status = 'CRITICAL'
    }

    healthcheck.checks.push(apiRouterHealthCheck)

    logInfo("Health Check Requested", {healthcheck, version}, null)

    return Response.json(healthcheck)
}
