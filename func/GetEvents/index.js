var azure = require('azure-storage');
var moment = require('moment');

module.exports = function (context, myTimer) {
    var tableSvc = azure.createTableService();
    var queueSvc = azure.createQueueService();
    queueSvc.messageEncoder = new azure.QueueMessageEncoder.TextBase64QueueMessageEncoder();
    tableSvc.createTableIfNotExists('meetup', function (error, result, response) { if (!error) { } });
    queueSvc.createQueueIfNotExists('meetup-refresh', function (error, result, response) { if (!error) { } });

    tableSvc.queryEntities('meetup', new azure.TableQuery(), null, function (error, result, response) {
        if (!error) {
            result.entries.forEach(value => {
                var message = {
                    area: value.PartitionKey._,
                    name: value.RowKey._,
                    LastQueriedUTC: (value.LastQueriedUTC || { _: '2016-01-01T00:00:00.000' })._
                };
                if(moment().subtract('1', 'day') >= moment(message.LastQueriedUTC)) {
                    queueSvc.createMessage('meetup-refresh', JSON.stringify(message).trim(), function(error) { if (!error) {}});
                }
                context.log(message);
            });
            if (result.continuationToken != null) {
                response.continuationToken = result.continuationToken;
            }
        }
        if (result.continuationToken == null) {
            context.done();
        }
    });
};