param (
    [Parameter()][string]$servicePrincipalName,
    [Parameter()][securestring]$servicePrincipalPassword,
    [Parameter()][string]$tenantID,
    [Parameter()][string]$resourceGroup,
    [Parameter()][string]$templateFile
    )

# $cred = New-Object -TypeName "System.Management.Automation.PSCredential" -ArgumentList $servicePrincipalName, $servicePrincipalPassword
# $cred = Get-Credential -UserName $servicePrincipalName -Message "Enter Password"
# Connect-AzureRmAccount -Credential $cred -ServicePrincipal -TenantId $tenantID
Connect-AzureRmAccount

$deploymentName = "CakeDeploy_" + $(get-date -f MM-dd-yyyy) + "_" + $(get-date -f HH_mm_ss)
New-AzureRmResourceGroupDeployment -Mode Complete -Name $deploymentName -ResourceGroupName $resourceGroup -TemplateFile $templateFile
$outputs = (Get-AzureRmResourceGroupDeployment -ResourceGroupName $resourceGroup -Name $deploymentName).Outputs
$outputs
