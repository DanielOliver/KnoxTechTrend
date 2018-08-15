var http = require('http');

module.exports = function (context, myTimer) {
    context.log('JavaScript HTTP trigger function processed a request.');

    var options = {
        host: 'https://ci.appveyor.com/api/builds',
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.appveyor_api_key}`,
            'content-type': 'application/json'
        },
        body: {
            "accountName": "DanielOliver",
            "projectSlug": "KnoxTechTrend",
            "branch": process.env.appveyor_branch,
            "environmentVariables": {
                "target": "Deploy-Netlify",
                "APPVEYOR_REPO_TAG_OVERRIDE": process.env.appveyor_is_tagged
            }
        }

    };

    // Set up the request
    var req = http.request(options, (res) => {
        res.on("end", () => {
            context.log("done")
            context.done();
        });
    }).on("error", (error) => {
        context.log('error');
        context.res = {
            status: 500,
            body: error
        };
        context.done();
    });
    req.end();
};
