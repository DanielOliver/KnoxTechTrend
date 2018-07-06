param (
    [Parameter()][string]$displayName,
    [Parameter()][string]$password,
    [Parameter()][string]$url
    )

Add-Type -Assembly System.Web
$securePassword = ConvertTo-SecureString -Force -AsPlainText -String $password
$app = New-AzureRmADApplication –DisplayName $displayName –HomePage $url –IdentifierUris $url –Password $securePassword
$principal = New-AzureRmADServicePrincipal –ApplicationId $app.ApplicationId
$role = New-AzureRmRoleAssignment –RoleDefinitionName Contributor –ServicePrincipalName $app.ApplicationId