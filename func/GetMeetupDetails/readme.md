# GetMeetupDetails

Checks to see if Meetup Event has been updated recently. Adds details for meetup.

```json
{
  "disabled": false,
  "bindings": [
    {
      "name": "meetupToAdd",
      "type": "queueTrigger",
      "direction": "in",
      "queueName": "meetup-add-details",
      "connection": "AzureWebJobsStorage"
    }
  ]
}
```