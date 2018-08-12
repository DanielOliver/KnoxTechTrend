#addin nuget:?package=Cake.Powershell&version=0.4.5
#addin nuget:?package=Cake.Kudu.Client&version=0.5.0
#addin nuget:?package=Cake.Npm&version=0.13.0

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
var isValidDeployment = false;
if(resourceGroupName == null) {
    if(isMasterBranch && isTagged) {
        resourceGroupName = "production";
        isValidDeployment = true;
    } else if (isMasterBranch) {
        resourceGroupName = "test";
        isValidDeployment = true;
    } else if (isDevelopBranch) {
        resourceGroupName = "develop";
        isValidDeployment = true;
    } else {
        // This might as well be default for a while.
        resourceGroupName = "develop";
    }
}

var templateFile = "azure/arm/deployment.json";
var parameterFileName = Argument("PARAMETER_FILE_NAME", EnvironmentVariable("PARAMETER_FILE_NAME"));
if(parameterFileName == null && resourceGroupName != null) {
    parameterFileName = $"azure/parameters/{resourceGroupName}.json";
}
var hasAzureParameters = !string.IsNullOrWhiteSpace(parameterFileName);
var shouldDeployToAzure = isValidDeployment && !string.IsNullOrWhiteSpace(resourceGroupName) && hasAzureParameters;



string kuduUserName   = EnvironmentVariable("KUDU_CLIENT_USERNAME"),
       kuduPassword   = EnvironmentVariable("KUDU_CLIENT_PASSWORD");
var functionsSourcePath = Directory("./func");


var netlifyAccesToken = EnvironmentVariable("NETLIFY_ACCESS_TOKEN");
var netlifyToml = "./netlify-" + resourceGroupName + ".toml";

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

    Information("Branch:             {0}", branch);
    Information("TagName:            {0}", tagName);
    Information("AzureRG:            {0}", resourceGroupName);
    Information("TemplateFile:       {0}", templateFile);
    Information("ParameterFile:      {0}", parameterFileName);
    Information("HasAzureParameters: {0}", hasAzureParameters);
    Information("IsAzureDeploy:      {0}", shouldDeployToAzure);
    Information("NetlifyTOML:        {0}", netlifyToml);
    
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
    CleanDirectory("temp");
});

Task("Build")
    .IsDependentOn("Clean")
    .Does(() =>
{
});

Task("npm-install")
    .IsDependentOn("clean")
    .Does(() =>
{
    Information("Installing packages for JAMStack...");
    NpmInstall(new NpmInstallSettings 
    {
        WorkingDirectory = "jam"
    });
    Information("Installed packages for JAMStack.");
});

Task("npm-build")
    .IsDependentOn("npm-install")
    .Does(() => 
{
    Information("Building JAMStack...");
    var settings = 
        new NpmRunScriptSettings 
        {
            ScriptName = "build",
            WorkingDirectory = "jam"
        };
    NpmRunScript(settings);
    Information("Built JAMStack...");
});

Task("Deploy-Netlify")
    .WithCriteria(() => hasAzureParameters && shouldDeployToAzure)
    .IsDependentOn("npm-build")
    .Does(() => 
{
    Information("Deploying to Netlify...");
    
    StartPowershellFile("azure/cli/deploy_jam.ps1", new PowershellSettings()
        .WithArguments(args =>
        {
            args.AppendSecret("accessToken", netlifyAccesToken)
                .Append("netlifyTomlFile", netlifyToml);
        }));

    Information("Deployed to Netlify...");
});

Task("DeployTemplateToAzure")
    .WithCriteria(() => hasAzureParameters)
    .IsDependentOn("Build")    
    .Does(() =>
{
    Information("Deploying Template to Azure...");
    StartPowershellFile("azure/cli/deploy.ps1", new PowershellSettings()
        .WithArguments(args =>
        {
            args.AppendSecret("tenantID", tenantID)
                .AppendSecret("servicePrincipalName", servicePrincipalName)
                .AppendSecret("servicePrincipalPassword", servicePrincipalPassword)
                .AppendSecret("meetupApiKey", meetupApiKey)
                .Append("resourceGroup", resourceGroupName)
                .Append("templateParameterFile", parameterFileName)
                .Append("templateFile", templateFile)
                .Append("shouldDeploy", (shouldDeployToAzure ? "yes" : "no"));
        }));
    if(shouldDeployToAzure) {
        Information("Deployed Template to Azure");
    } else {
        Information("Validated Template against Azure");
    }
});

Task("DeployFunctionsToAzure")
    .WithCriteria(() => hasAzureParameters && shouldDeployToAzure & !string.IsNullOrWhiteSpace(kuduUserName) && !string.IsNullOrWhiteSpace(kuduPassword))
    .IsDependentOn("DeployTemplateToAzure")    
    .Does(() =>
{
    Information("Deploying Functions to Azure...");
    
    var appServiceNameUrl = "https://" + System.IO.File.ReadAllText("temp/appServiceName.tmp") + ".scm.azurewebsites.net";
    Information("Deploying to: " + appServiceNameUrl);

    IKuduClient kuduClient = KuduClient(
        appServiceNameUrl,
        kuduUserName,
        kuduPassword);

    kuduClient.ZipDeployDirectory(functionsSourcePath);

    Information("Deployed Functions to Azure");
});

//////////////////////////////////////////////////////////////////////
// TASK TARGETS
//////////////////////////////////////////////////////////////////////

Task("Default")
    .IsDependentOn("Deploy-Netlify")
    .IsDependentOn("DeployFunctionsToAzure");

//////////////////////////////////////////////////////////////////////
// EXECUTION
//////////////////////////////////////////////////////////////////////

RunTarget(target);