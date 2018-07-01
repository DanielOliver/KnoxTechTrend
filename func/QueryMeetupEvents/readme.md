# QueryMeetupEvents

Queries meetup for new past events.

```json
{
  "disabled": false,
  "bindings": [
    {
      "name": "meetupToRefresh",
      "type": "queueTrigger",
      "direction": "in",
      "queueName": "meetup-refresh",
      "connection": "AzureWebJobsStorage"
    }
  ]
}
```