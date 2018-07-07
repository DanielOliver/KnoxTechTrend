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

var templateFile = "azure/arm/deployment.json";
var parameterFileName = Argument("PARAMETER_FILE_NAME", EnvironmentVariable("PARAMETER_FILE_NAME"));
if(parameterFileName == null && resourceGroupName != null) {
    parameterFileName = $"azure/parameters/{resourceGroupName}.json";
}
var shouldDeployToAzure = !string.IsNullOrWhiteSpace(resourceGroupName) && !string.IsNullOrWhiteSpace(parameterFileName);

//////////////////////////////////////////////////////////////////////
// PREPARATION
//////////////////////////////////////////////////////////////////////

// Define directories.
var buildDir = Directory("./build") + Directory(configuration);



///////////////////////////////////////////////////////////////////////////////
// SETUP / TEARDOWN
///////////////////////////////////////////////////////////////////////////////

Setup(context => {
    Information("Starting Setup...");

    Information("Branch:        {0}", branch);
    Information("TagName:       {0}", tagName);
    Information("AzureRG:       {0}", resourceGroupName);
    Information("TemplateFile:  {0}", templateFile);
    Information("ParameterFile: {0}", parameterFileName);
    Information("IsAzureDeploy: {0}", shouldDeployToAzure);
    
});

Teardown(context => {
    Information("Starting Teardown...");
    Information("Finished running tasks.");
});

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
    .WithCriteria(() => shouldDeployToAzure)
    .IsDependentOn("Build")    
    .Does(() =>
{
    Information("Deploying to Azure...");
    StartPowershellFile("azure/cli/deploy.ps1", new PowershellSettings()
        .WithArguments(args =>
        {
            args.AppendSecret("tenantID", tenantID)
                .AppendSecret("servicePrincipalName", servicePrincipalName)
                .AppendSecret("servicePrincipalPassword", servicePrincipalPassword)
                .AppendSecret("meetupApiKey", meetupApiKey)
                .Append("resourceGroup", resourceGroupName)
                .Append("templateParameterFile", parameterFileName)
                .Append("templateFile", templateFile);
        }));
    Information("Deployed to Azure");
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