param (
    [Parameter(Mandatory=$true)][string]$displayName,
    [Parameter(Mandatory=$true)][string]$password,
    [Parameter()][string]$identifierUri = "http://localhost"
    )

$app = Get-AzureRmADApplication -IdentifierUri $identifierUri
if(!$app) {
    Add-Type -Assembly System.Web
    $securePassword = ConvertTo-SecureString -Force -AsPlainText -String $password
    $app = New-AzureRmADApplication -DisplayName "apiuser" -HomePage $identifierUri -IdentifierUris $identifierUri -Password $securePassword
    $principal = New-AzureRmADServicePrincipal -ApplicationId $app.ApplicationId
    New-AzureRmRoleAssignment -RoleDefinitionName Contributor -ServicePrincipalName "$($principal.ServicePrincipalNames[0])"
} else {
    Write-Host "Application with identifying URI already exists."
}
