var azure = require('azure-storage');
var moment = require('moment');
var request = require('request');

module.exports = function (context, meetupToRefresh) {
    var tableSvc = azure.createTableService();
    var meetupUrl = `https://api.meetup.com/${meetupToRefresh.name}/events?key=${process.env.meetup_api_key}&sign=true&status=past&no_earlier_than=${moment(meetupToRefresh.LastQueriedUTC).format("YYYY-MM-DD")}T00:00:00&status=past`
    request(meetupUrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body) // Print the google web page.
        }
        context.done();
    })
};