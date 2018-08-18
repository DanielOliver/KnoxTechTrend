var https = require('https');

module.exports = function (context, myTimer) {
    context.log('JavaScript HTTP trigger function processed a request.');

    var options = {
        host: 'ci.appveyor.com',
        path: '/api/builds',
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.appveyor_api_key}`,
            'content-type': 'application/json'
        }
    }
    var body = {
            "accountName": "DanielOliver",
            "projectSlug": "KnoxTechTrend",
            "branch": process.env.appveyor_branch,
            "environmentVariables": {
                "target": "Deploy-Netlify",
                "APPVEYOR_REPO_TAG_OVERRIDE": process.env.appveyor_is_tagged
            }
        }
    if(process.env.git_commit_id) {
        body.commitId = process.env.git_commit_id
    }

    // Set up the request
    var req = https.request(options, (res) => {
        context.log(`STATUS: ${res.statusCode}`)
        context.log(`HEADERS: ${JSON.stringify(res.headers)}`)
        res.setEncoding('utf8')
        
        res.on('data', (d) => {
            context.log(`Data: ${d}`)
        });
        res.on("end", () => {
            context.log("done")
            context.done()
        });
    }).on("error", (error) => {
        context.log('error')
        context.log(error)
        context.res = {
            status: 500,
            body: error
        };
        context.done()
    });

    req.write(JSON.stringify(body))
    req.end()
};
