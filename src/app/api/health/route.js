import { logInfo } from '@/utils/log/log';
import { version } from 'react';

export async function GET() {

    // TODO Add check for dependencies and depending on result potentially change the below check.

    const check = {
        "name": "dis-data-admin-ui-check",
        "status": "OK",
        "status_code": "200",
        "message": "OK",
        "last_checked": new Date().toISOString(),
        "last success": new Date().toISOString(),
        "last failure": null
    }

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

    healthcheck.checks.push(check)

    logInfo("Health Check Requested", {healthcheck, version}, null)

    return Response.json(healthcheck)
}
