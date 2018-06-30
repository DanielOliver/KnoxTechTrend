var azure = require('azure-storage');
var moment = require('moment');
var request = require('request');

module.exports = function (context, meetupToAdd) {
    var tableSvc = azure.createTableService();
    var meetupUrl = `https://api.meetup.com/${meetupToAdd.name}?key=${process.env.meetup_api_key}&sign=true`
    request(meetupUrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            const item = JSON.parse(body);
            const entGen = azure.TableUtilities.entityGenerator;
            const newTask = {
                PartitionKey: entGen.String(meetupToAdd.area),
                RowKey: entGen.String(meetupToAdd.name),

                City: entGen.String(item.city),
                State: entGen.String(item.state),
                Country: entGen.String(item.country),

                MembersCount: entGen.Int32(item.members),
                FullName: entGen.String(item.name),
                Link: entGen.String(item.link),
                UrlName: entGen.String(item.urlname),
                LastQueriedUTC: entGen.DateTime(moment())
            };
            tableSvc.mergeEntity('meetup', newTask, function (error, result, response) { if (!error) { } });
        }
        context.done();
    })
};