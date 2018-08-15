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
                var message = {
                    area: value.PartitionKey._,
                    name: value.RowKey._,
                    LastQueriedUTC: moment((value.LastQueriedUTC || { _: '2015-01-01T00:00:00.000' })._ || '2015-01-01T00:00:00.000').toDate(),
                    LastEventsQueriedUTC: moment((value.LastEventsQueriedUTC || { _: '2015-01-01T00:00:00.000' })._ || '2015-01-01T00:00:00.000').toDate(),
                    LastQueriedLocal: (value.Timezone != null && value.LastQueriedUTC != null ? moment_tz().tz(value.LastQueriedUTC, value.Timezone).toDate() : null),
                    LastEventsQueriedLocal: (value.Timezone != null && value.LastEventsQueriedUTC != null ? moment_tz().tz(value.LastEventsQueriedUTC, value.Timezone).toDate() : null),
                    Timezone: (value.Timezone || 'US/Eastern')
                };
                if (moment().subtract('30', 'day') >= moment(message.LastQueriedUTC)) {
                    context.log(`Refreshing meetup: ${value.RowKey._}.`);
                    queueSvc.createMessage('meetup-add-details', JSON.stringify(message).trim(), function (error) { if (!error) { } });
                }
                if (moment().subtract('10', 'hours') >= moment(message.LastEventsQueriedUTC)) {
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