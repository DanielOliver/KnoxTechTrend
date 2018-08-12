# GetEvents

Checks to see if Meetup Event has been updated recently. If not, enqueues request to refresh data.

```json
{
  "disabled": false,
  "bindings": [
    {
      "name": "myTimer",
      "type": "timerTrigger",
      "direction": "in",
      "schedule": "0 0 */8 * * *"
    }
  ]
}
```