param (
    [Parameter()][string]$armOutput
    )

#region Convert from json
$json = ""
IF([string]::IsNullOrEmpty($armOutput)) {            
    Write-Host "Using environment variable"
    $json = $env:armOutput
} else {
    Write-Host "Using parameter"
    $json = $armOutput
}
$json
$json = $json | convertfrom-json
#endregion

az storage table create --name meetup --account-name $json.storageAccountName.value
az storage table create --name events --account-name $json.storageAccountName.value
az storage queue create --name meetup-refresh --account-name $json.storageAccountName.value
az storage queue create --name meetup-add-details --account-name $json.storageAccountName.value
