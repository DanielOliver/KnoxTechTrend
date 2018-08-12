param (
    [Parameter()][string]$accessToken,
    [Parameter()][string]$netlifyTomlFile
)

$url = "https://github.com/netlify/netlifyctl/releases/download/v0.4.0/netlifyctl-windows-amd64-0.4.0.zip"
$output = "temp/netlifyctl.zip"

If( -Not (Test-Path -path $output)) {
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    Invoke-WebRequest -Uri $url -OutFile $output
    Expand-Archive -Path $output -DestinationPath "temp/netlifyctl"
}
Copy-Item -Path $netlifyTomlFile -Destination "netlify.toml"
& "temp/netlifyctl/netlifyctl.exe" "-A" $accessToken "deploy" 
Remove-Item -Path "netlify.toml"
