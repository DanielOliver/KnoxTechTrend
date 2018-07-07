#addin nuget:?package=Cake.Powershell&version=0.4.5
//////////////////////////////////////////////////////////////////////
// ARGUMENTS
//////////////////////////////////////////////////////////////////////

var target = Argument("target", "Default");
var configuration = Argument("configuration", "Release");

var meetupApiKey = Argument("MEETUP_API_KEY", EnvironmentVariable("MEETUP_API_KEY"));
var tenantID = Argument("TENANT_ID", EnvironmentVariable("TENANT_ID"));
var servicePrincipalName = Argument("SERVICE_PRINCIPAL_NAME", EnvironmentVariable("SERVICE_PRINCIPAL_NAME"));
var servicePrincipalPassword = Argument("SERVICE_PRINCIPAL_PASSWORD", EnvironmentVariable("SERVICE_PRINCIPAL_PASSWORD"));

var branch = EnvironmentVariable("APPVEYOR_REPO_BRANCH") ?? "";
var isMasterBranch = branch.ToUpper().Contains("MASTER");
var isDevelopBranch = branch.ToUpper().Contains("DEVELOP");
var isTagged = (EnvironmentVariable("APPVEYOR_REPO_TAG") ?? "").Contains("true");
var tagName = EnvironmentVariable("APPVEYOR_REPO_TAG_NAME") ?? "";

var resourceGroupName = Argument("RESOURCE_GROUP_NAME", EnvironmentVariable("RESOURCE_GROUP_NAME"));
if(resourceGroupName == null) {
    if(isMasterBranch && isTagged) {
        resourceGroupName = "production";
    } else if (isMasterBranch) {
        resourceGroupName = "test";
    } else if (isDevelopBranch) {
        resourceGroupName = "develop";
    }
}
var parameterFileName = Argument("PARAMETER_FILE_NAME", EnvironmentVariable("PARAMETER_FILE_NAME"));
if(parameterFileName == null && resourceGroupName != null) {
    parameterFileName = $"azure/parameters/{resourceGroupName}.json";
}
var shouldDeployAzure = !string.IsNullOrWhiteSpace(resourceGroupName) && !string.IsNullOrWhiteSpace(parameterFileName);

//////////////////////////////////////////////////////////////////////
// PREPARATION
//////////////////////////////////////////////////////////////////////

// Define directories.
var buildDir = Directory("./build") + Directory(configuration);

//////////////////////////////////////////////////////////////////////
// TASKS
//////////////////////////////////////////////////////////////////////

Task("Clean")
    .Does(() =>
{
    CleanDirectory(buildDir);
});

Task("Build")
    .IsDependentOn("Clean")
    .Does(() =>
{

});


Task("DeployTemplateToAzure")
    .IsDependentOn("Build")
    .Does(() =>
{
    StartPowershellFile("azure/cli/deploy.ps1", new PowershellSettings()
        .WithArguments(args =>
        {
            args.AppendSecret("tenantID", tenantID)
                .AppendSecret("servicePrincipalName", servicePrincipalName)
                .AppendSecret("servicePrincipalPassword", servicePrincipalPassword)
                .AppendSecret("meetupApiKey", meetupApiKey)
                .Append("resourceGroup", resourceGroupName)
                .Append("templateParameterFile", parameterFileName)
                .Append("templateFile", "azure/arm/deployment.json");
        }));
});

//////////////////////////////////////////////////////////////////////
// TASK TARGETS
//////////////////////////////////////////////////////////////////////

Task("Default")
    .IsDependentOn("DeployTemplateToAzure")
    .IsDependentOn("Build");

//////////////////////////////////////////////////////////////////////
// EXECUTION
//////////////////////////////////////////////////////////////////////

RunTarget(target);