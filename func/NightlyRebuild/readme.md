# NightlyRebuild

Builds new website each night.

```json
{
  "disabled": false,
  "bindings": [
    {
      "name": "myTimer",
      "type": "timerTrigger",
      "direction": "in",
      "schedule": "0 0 4 * * *"
    }
  ]
}
```