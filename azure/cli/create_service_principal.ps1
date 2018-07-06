param (
    [Parameter()][string]$displayName,
    [Parameter()][string]$password,
    [Parameter()][string]$identifierUri
    )

$app = Get-AzureRmADApplication -IdentifierUri $identifierUri
if(!$app) {
    Add-Type -Assembly System.Web
    $securePassword = ConvertTo-SecureString -Force -AsPlainText -String $password
    $app = New-AzureRmADApplication –DisplayName "apiuser" –HomePage $identifierUri –IdentifierUris $identifierUri –Password $securePassword
    New-AzureRmADServicePrincipal –ApplicationId $app.ApplicationId
    New-AzureRmRoleAssignment –RoleDefinitionName Contributor –ServicePrincipalName $app.ApplicationId
}