export async function GET() {
    const healthcheck = {
        "status": "OK",
        "version": {
            "build_time": process.env.BUILD_TIME ? process.env.BUILD_TIME : "",
            "git_commit": "",
            "language": "",
            "language_version": "",
            "version": ""
        },
        "uptime": 0,
        "start_time": "",
        "checks": []
    }
   
    return Response.json(healthcheck)
}