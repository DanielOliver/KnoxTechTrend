param (
    [Parameter()][string]$servicePrincipalName,
    [Parameter()][string]$servicePrincipalPassword,
    [Parameter()][string]$tenantID,
    [Parameter()][string]$resourceGroup,
    [Parameter()][string]$templateFile,
    [Parameter()][string]$templateParameterFile,
    [Parameter()][string]$meetupApiKey
    )

# Import-Module AzureRM
# Add-Type -Assembly System.Web
$securePassword = ConvertTo-SecureString -Force -AsPlainText -String $servicePrincipalPassword
$cred = New-Object -TypeName "System.Management.Automation.PSCredential" ($servicePrincipalName, $securePassword)
Connect-AzureRmAccount -Credential $cred -ServicePrincipal -TenantId $tenantID

$deploymentName = ("CakeDeploy_" + $(get-date -f MM-dd-yyyy) + "_" + $(get-date -f HH_mm_ss)) -replace "-","_"
$parameters  = @{
    "meetup_api_key"=$meetupApiKey
}
New-AzureRmResourceGroupDeployment -Mode Complete -Name $deploymentName -ResourceGroupName $resourceGroup -TemplateFile $templateFile -TemplateParameterFile $templateParameterFile
$outputs = (Get-AzureRmResourceGroupDeployment -ResourceGroupName $resourceGroup -Name $deploymentName).Outputs
$outputs
