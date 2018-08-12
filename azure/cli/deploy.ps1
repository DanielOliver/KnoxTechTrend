param (
    [Parameter()][string]$servicePrincipalName,
    [Parameter()][string]$servicePrincipalPassword,
    [Parameter()][string]$tenantID,
    [Parameter()][string]$resourceGroup = "develop",
    [Parameter()][string]$templateFile = "../arm/deployment.json",
    [Parameter()][string]$templateParameterFile = "../parameters/develop.json",
    [Parameter()][string]$meetupApiKey = "",
    [Parameter()][string]$shouldDeploy = "no" # or yes
)

$securePassword = ConvertTo-SecureString -Force -AsPlainText -String $servicePrincipalPassword
$cred = New-Object -TypeName "System.Management.Automation.PSCredential" ($servicePrincipalName, $securePassword)
Write-Host "Logging into Azure"
$connect = Connect-AzureRmAccount -Credential $cred -ServicePrincipal -TenantId $tenantID
if(!$connect) {
    Write-Error "Failed to login to Azure."
}

$deploymentName = ("CakeDeploy_" + $(get-date -f yyyy_MM_dd) + "_" + $(get-date -f HH_mm_ss))
Write-Host "Deployment Name: $deploymentName"

$ErrorActionPreference = "Stop"
if($shouldDeploy -eq "yes") {
    Write-Host "Deploying Resources to Azure"
    New-AzureRmResourceGroupDeployment -Mode Complete -Name $deploymentName -ResourceGroupName $resourceGroup -TemplateFile $templateFile -TemplateParameterFile $templateParameterFile -Force -meetup_api_key $meetupApiKey | Out-Null
    $outputs = (Get-AzureRmResourceGroupDeployment -ResourceGroupName $resourceGroup -Name $deploymentName).Outputs

    Write-Host "Creating tables and queues in Azure Storage"
    $storageName = $outputs.storageAccountName.value
    $storageContext = Get-AzureRmStorageAccount -StorageAccountName $storageName -ResourceGroupName $resourceGroup
    New-AzureStorageTable -Name "meetup" -Context $storageContext.Context -ErrorAction SilentlyContinue
    New-AzureStorageTable -Name "events" -Context $storageContext.Context -ErrorAction SilentlyContinue
    New-AzureStorageQueue -Name "meetup-refresh" -Context $storageContext.Context -ErrorAction SilentlyContinue
    New-AzureStorageQueue -Name "meetup-add-details" -Context $storageContext.Context -ErrorAction SilentlyContinue

    Write-Host "Write output name for Azure Functions Name"
    $env:APP_SERVICE_NAME = $outputs.appServiceName.value
    # New-Item -ItemType Directory "temp" -Force
    # Out-File -FilePath "./temp/appServiceName.tmp" -Encoding string -NoNewline -InputObject $($outputs.appServiceName.value) -Force
} else {
    Write-Host "Testing Deployment Validation to Azure"
    Test-AzureRmResourceGroupDeployment -Mode Complete -ResourceGroupName $resourceGroup -TemplateFile $templateFile -TemplateParameterFile $templateParameterFile -meetup_api_key $meetupApiKey | Out-Null
}
