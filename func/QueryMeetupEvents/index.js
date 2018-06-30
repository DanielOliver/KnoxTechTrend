var azure = require('azure-storage');
var moment = require('moment');
var request = require('request');

module.exports = function (context, meetupToRefresh) {
    var tableSvc = azure.createTableService();
    var meetupUrl = `https://api.meetup.com/${meetupToRefresh.name}/events?key=${process.env.meetup_api_key}&sign=true&status=past&no_earlier_than=${moment(meetupToRefresh.LastQueriedUTC).format("YYYY-MM-DD")}T00:00:00&status=past`
    request(meetupUrl, function (error, response, body) {        
        if (!error && response.statusCode == 200) {
            const items = JSON.parse(body);
            console.log(items);            
        }
        const entGen = azure.TableUtilities.entityGenerator;
        const updatedTask = {
            PartitionKey: entGen.String(meetupToRefresh.area),
            RowKey: entGen.String(meetupToRefresh.name),
            LastQueriedUTC: entGen.DateTime(moment()),
          };
        tableSvc.mergeEntity('meetup', updatedTask, function(error, result, response){ if(!error) { }});
        context.done();
    })
};