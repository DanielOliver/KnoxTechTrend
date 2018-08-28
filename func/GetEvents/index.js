var azure = require('azure-storage');
var moment = require('moment');
var moment_tz = require('moment-timezone');

module.exports = function (context, myTimer) {
    var tableSvc = azure.createTableService();
    var queueSvc = azure.createQueueService();
    queueSvc.messageEncoder = new azure.QueueMessageEncoder.TextBase64QueueMessageEncoder();
    tableSvc.createTableIfNotExists('meetup', function (error, result, response) { if (!error) { } });
    queueSvc.createQueueIfNotExists('meetup-refresh', function (error, result, response) { if (!error) { } });
    queueSvc.createQueueIfNotExists('meetup-add-details', function (error, result, response) { if (!error) { } });

    const query = new azure.TableQuery().select(['PartitionKey', 'RowKey', 'LastQueriedUTC', 'LastEventsQueriedUTC', 'Timezone']);
    tableSvc.queryEntities('meetup', query, null, function (error, result, response) {
        if (!error) {
            result.entries.forEach(value => {

                var lastQueriedUtc = moment.utc((value.LastQueriedUTC || { _: '2015-01-01T00:00:00.000' })._ || '2015-01-01T00:00:00.000').toDate();
                var lastEventsQueriedUTC = moment.utc((value.LastEventsQueriedUTC || { _: '2015-01-01T00:00:00.000' })._ || '2015-01-01T00:00:00.000').subtract(1, "days").toDate();

                var timezone = (value.Timezone || { _: 'US/Eastern' })._ || 'US/Eastern';

                var localMeetup = moment(lastQueriedUtc).utc().tz(timezone).format();
                var localEvents = moment(lastEventsQueriedUTC).utc().tz(timezone).format();
                
                var message = {
                    area: value.PartitionKey._,
                    name: value.RowKey._,
                    LastQueriedUTC: lastQueriedUtc,
                    LastEventsQueriedUTC: lastEventsQueriedUTC,
                    LastQueriedLocal: localMeetup,
                    LastEventsQueriedLocal: localEvents,
                    Timezone: timezone
                };
                if (moment_tz().utc().subtract('30', 'day') >= moment(message.LastQueriedUTC)) {
                    context.log(`Refreshing meetup: ${value.RowKey._}.`);
                    queueSvc.createMessage('meetup-add-details', JSON.stringify(message).trim(), function (error) { if (!error) { } });
                }
                if (moment_tz().utc().subtract('1', 'day') >= moment(message.LastEventsQueriedUTC)) {
                    context.log(`Refreshing events for meetup: ${value.RowKey._}.`);
                    queueSvc.createMessage('meetup-refresh', JSON.stringify(message).trim(), function (error) { if (!error) { } });
                }
            });
            if (result.continuationToken != null) {
                response.continuationToken = result.continuationToken;
            }
        }
        if (result == null || result.continuationToken == null) {
            context.done();
        }
    });
};