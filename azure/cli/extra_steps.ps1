param (
    [Parameter(Mandatory=$true)][string]$ARMOutput
    )

#region Convert from json
$json = $ARMOutput | convertfrom-json
#endregion

az storage table create --name meetup --account-name $json.storageAccountName.value
az storage table create --name events --account-name $json.storageAccountName.value
az storage queue create --name meetup-refresh --account-name $json.storageAccountName.value
az storage queue create --name meetup-add-details --account-name $json.storageAccountName.value
