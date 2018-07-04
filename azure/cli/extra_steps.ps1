 param (
    [Parameter(Mandatory=$true)][string]$storageAccountName
 )

az storage table create --name meetup --account-name $storageAccountName
az storage table create --name events --account-name $storageAccountName
az storage queue create --name meetup-refresh --account-name $storageAccountName
az storage queue create --name meetup-add-details --account-name $storageAccountName