var azure = require('azure-storage');
var moment = require('moment');
var moment_tz = require('moment-timezone');
var request = require('request');

module.exports = function (context, meetupToRefresh) {
    var tableSvc = azure.createTableService();
    tableSvc.createTableIfNotExists('events', function (error, result, response) { if (!error) { } });
    var meetupUrl = `https://api.meetup.com/${meetupToRefresh.name}/events?key=${process.env.meetup_api_key}&sign=true&status=past&no_earlier_than=${moment(meetupToRefresh.LastEventsQueriedLocal).format("YYYY-MM-DD")}T00:00:00`
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

                        MeetupDateLocal: entGen.DateTime(`${element.local_date}T${element.local_time}:00.000`),
                        MeetupDateUtc: entGen.DateTime(moment_tz().tz(element.local_date, meetupToRefresh.Timezone)),
                        RsvpCount: entGen.Int32(element.yes_rsvp_count),
                        RsvpLimit: entGen.Int32(element.rsvp_limit),
                        WaitListCount: entGen.Int32(element.waitlist_count),
                        AttendenceCount: entGen.Int32(element.attendance_count),
                        ManualAttendenceCount: entGen.Int32(element.manual_attendance_count),
                        Duration: entGen.Int64(element.duration),

                        Status: entGen.String(element.status),
                        Link: entGen.String(element.link),
                        ShortLink: entGen.String(element.short_link),

                        Description: entGen.String(element.description),
                        PlainTextDescription: entGen.String(element.plain_text_description),
                        SimpleHtmlDescription: entGen.String(element.simple_html_description),
                        Name: entGen.String(element.name),

                        Latitude: entGen.Double(element.lat),
                        Longitude: entGen.Double(element.lon),

                        VenueName: entGen.String((element.venue || { name: null }).name),
                        VenueAddress1: entGen.String((element.venue || { address_1: null }).address_1),
                        VenueAddress2: entGen.String((element.venue || { address_2: null }).address_2),
                        VenueAddress3: entGen.String((element.venue || { address_3: null }).address_3),
                        VenueCity: entGen.String((element.venue || { city: null }).city),
                        VenueState: entGen.String((element.venue || { state: null }).state),
                        VenueZip: entGen.String((element.venue || { zip: null }).zip),
                        VenueCountry: entGen.String((element.venue || { country: null }).country),
                        VenueID: entGen.Int32((element.venue || { id: null }).id)
                        VenueLongitude: entGen.String((element.venue || { lon: null }).lon),
                        VenueLatitude: entGen.Int32((element.venue || { lat: null }).lat)
                    };

                    batch.insertOrMergeEntity(newTask);
                });
                tableSvc.executeBatch('events', batch, function (error, result, response) { if (!error) { } });
            }
        } else {
            context.log('QueryMeetupEvents Failed: ' + JSON.stringify(meetupToAdd));
        }
        const entGen = azure.TableUtilities.entityGenerator;
        const updatedTask = {
            PartitionKey: entGen.String(meetupToRefresh.area),
            RowKey: entGen.String(meetupToRefresh.name),
            LastEventsQueriedUTC: entGen.DateTime(moment())
        };
        tableSvc.mergeEntity('meetup', updatedTask, function (error, result, response) { if (!error) { } });
        context.done();
    })
};