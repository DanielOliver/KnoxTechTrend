param (
    [Parameter()][string]$servicePrincipalName,
    [Parameter()][string]$servicePrincipalPassword,
    [Parameter()][string]$tenantID,
    [Parameter()][string]$resourceGroup = "develop",
    [Parameter()][string]$templateFile = "../arm/deployment.json",
    [Parameter()][string]$templateParameterFile = "../parameters/develop.json",
    [Parameter()][string]$meetupApiKey = ""
)

$securePassword = ConvertTo-SecureString -Force -AsPlainText -String $servicePrincipalPassword
$cred = New-Object -TypeName "System.Management.Automation.PSCredential" ($servicePrincipalName, $securePassword)
$connect = Connect-AzureRmAccount -Credential $cred -ServicePrincipal -TenantId $tenantID
if(!$connect) {
    Write-Error "Failed to login to Azure."
}

$deploymentName = ("CakeDeploy_" + $(get-date -f yyyy_MM_dd) + "_" + $(get-date -f HH_mm_ss))
New-AzureRmResourceGroupDeployment -Mode Complete -Name $deploymentName -ResourceGroupName $resourceGroup -TemplateFile $templateFile -TemplateParameterFile $templateParameterFile -Force -meetup_api_key $meetupApiKey | Out-Null
$outputs = (Get-AzureRmResourceGroupDeployment -ResourceGroupName $resourceGroup -Name $deploymentName).Outputs

$storageName = $outputs.storageAccountName.value
$storageContext = Get-AzureRmStorageAccount -StorageAccountName $storageName -ResourceGroupName $resourceGroup
New-AzureStorageTable -Name "meetup" -Context $storageContext.Context
New-AzureStorageTable -Name "events" -Context $storageContext.Context
New-AzureStorageQueue -Name "meetup-refresh" -Context $storageContext.Context
New-AzureStorageQueue -Name "meetup-add-details" -Context $storageContext.Context
