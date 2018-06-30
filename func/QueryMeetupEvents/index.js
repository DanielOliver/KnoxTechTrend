var azure = require('azure-storage');
var moment = require('moment');
var request = require('request');

module.exports = function (context, meetupToRefresh) {
    var tableSvc = azure.createTableService();
    var meetupUrl = `https://api.meetup.com/${meetupToRefresh.name}/events?key=${process.env.meetup_api_key}&sign=true&status=past&no_earlier_than=${moment(meetupToRefresh.LastQueriedUTC).format("YYYY-MM-DD")}T00:00:00`
    request(meetupUrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            const items = JSON.parse(body);

            if (items.length > 0) {
                var batch = new azure.TableBatch();
                const entGen = azure.TableUtilities.entityGenerator;

                items.forEach(element => {
                    const newTask = {
                        PartitionKey: entGen.String(element.group.urlname),
                        RowKey: entGen.String(element.id),

                        MeetupDateLocal: entGen.String(`${element.local_date}T${element.local_time}:00.000`),
                        RsvpCount: entGen.Int32(element.yes_rsvp_count),
                        Status: entGen.String(element.status),
                        Link: entGen.String(element.link),
                        Description: entGen.String(element.description),
                        VenueName: entGen.String(element.venue.name),
                        VenueAddress1: entGen.String(element.venue.address_1),
                        VenueCity: entGen.String(element.venue.city),
                        VenueID: entGen.Int32(element.venue.id)
                    };

                    batch.insertOrMergeEntity(newTask);
                });
                tableSvc.executeBatch('events', batch, function (error, result, response) { if (!error) { } });
            }
        }
        const entGen = azure.TableUtilities.entityGenerator;
        const updatedTask = {
            PartitionKey: entGen.String(meetupToRefresh.area),
            RowKey: entGen.String(meetupToRefresh.name),
            LastQueriedUTC: entGen.DateTime(moment())
        };
        tableSvc.mergeEntity('meetup', updatedTask, function (error, result, response) { if (!error) { } });
        context.done();
    })
};