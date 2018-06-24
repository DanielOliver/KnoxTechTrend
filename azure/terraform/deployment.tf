resource "azurerm_resource_group" "test" {
  name     = "terraform-func-test"
  location = "westus2"
}

resource "random_id" "server" {
  keepers = {
    # Generate a new id each time we switch to a new Azure Resource Group
    rg_id = "${azurerm_resource_group.test.name}"
  }

  byte_length = 8
}

resource "azurerm_storage_account" "test" {
  name                     = "${random_id.server.hex}"
  resource_group_name      = "${azurerm_resource_group.test.name}"
  location                 = "${azurerm_resource_group.test.location}"
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_app_service_plan" "test" {
  name                = "azure-functions-test-service-plan"
  location            = "${azurerm_resource_group.test.location}"
  resource_group_name = "${azurerm_resource_group.test.name}"
  kind                = "FunctionApp"

  sku {
    tier = "Dynamic"
    size = "Y1"
  }
}

resource "azurerm_application_insights" "test" {
  name                = "test-terraform-insights"
  location            = "${azurerm_resource_group.test.location}"
  resource_group_name = "${azurerm_resource_group.test.name}"
  application_type    = "Web"
}

resource "azurerm_function_app" "test" {
  name                      = "test-terraform"
  location                  = "${azurerm_resource_group.test.location}"
  resource_group_name       = "${azurerm_resource_group.test.name}"
  app_service_plan_id       = "${azurerm_app_service_plan.test.id}"
  storage_connection_string = "${azurerm_storage_account.test.primary_connection_string}"

  app_settings {
    "AppInsights_InstrumentationKey" = "${azurerm_application_insights.test.instrumentation_key}"
  }
}
