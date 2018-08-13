param (
    [Parameter()][string]$connectionString
)

$env:AZURE_STORAGE_CONNECTION_STRING = $connectionString