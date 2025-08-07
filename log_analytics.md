# Install Azure Monitor Agent on Azure VM

## System-assigned managed identity

Set-AzVMExtension -Name AzureMonitorLinuxAgent -ExtensionType AzureMonitorLinuxAgent -Publisher Microsoft.Azure.Monitor -TypeHandlerVersion "1.13" -ResourceGroupName "cst8912lab10-RG" -VMName "cst8912lab10vm" -Location "canadacentral" -EnableAutomaticUpgrade $true

## Verify on VM

systemctl status azuremonitoragent

## Confirm the VM is connected to Log Analytics workspace

Set-AzVMExtension -ResourceGroupName "cst8912lab10-RG" -VMName "cst8912lab10vm" -Name "AzureMonitorLinuxAgent" -Publisher "Microsoft.Azure.Monitor" -ExtensionType "AzureMonitorLinuxAgent" -TypeHandlerVersion "1.13" -Location "canadacentral" -SettingString '{"workspaceId":"ed564411-b835-4d37-881a-ed776a0396a6"}'  -EnableAutomaticUpgrade $true


### Check if your diagnostic settings on the Log Analytics workspace or VM are configured to send logs/metrics to storage account

az monitor diagnostic-settings list --resource <VM-resource-id>

az monitor diagnostic-settings list --resource /subscriptions/373a9f57-d188-4529-a93b-527fd9acaafa/resourceGroups/cst8912lab10-RG/providers/Microsoft.Compute/virtualMachines/cst8912lab10vm
 
 

# Retrieve valid categories for your VM resource
$categories = Get-AzDiagnosticSettingCategory -ResourceId (Get-AzVM -ResourceGroupName "cst8912lab10-RG" -Name "cst8912lab10vm").Id

# Build objects for logs and metrics
$metrics = $categories | Where-Object CategoryType -eq "Metrics" | ForEach-Object { New-AzDiagnosticSettingMetricSettingsObject -Enabled $true -Category $_.Name }
$logs    = $categories | Where-Object CategoryType -eq "Logs"    | ForEach-Object { New-AzDiagnosticSettingLogSettingsObject -Enabled $true -Category $_.Name }

# Create diagnostic setting using valid categories
New-AzDiagnosticSetting -Name "VM-Diagnostics" -ResourceId (Get-AzVM -ResourceGroupName "cst8912lab10-RG" -Name "cst8912lab10vm").Id -WorkspaceId "/subscriptions/373a9f57-d188-4529-a93b-527fd9acaafa/resourceGroups/DefaultResourceGroup-CCAN/providers/Microsoft.OperationalInsights/workspaces/DefaultWorkspace-373a9f57-d188-4529-a93b-527fd9acaafa-CCAN" -Log $logs -Metric $metrics


# Get storage account resource ID
$storageId = (Get-AzStorageAccount -ResourceGroupName "cst8912lab10-RG" -Name "cst8912lab10storage").Id

# Get supported categories
$categories = Get-AzDiagnosticSettingCategory -ResourceId $storageId

# Create log and metric objects
$metrics = $categories | Where-Object CategoryType -eq "Metrics" | ForEach-Object { New-AzDiagnosticSettingMetricSettingsObject -Enabled $true -Category $_.Name }
$logs    = $categories | Where-Object CategoryType -eq "Logs"    | ForEach-Object { New-AzDiagnosticSettingLogSettingsObject -Enabled $true -Category $_.Name }

# Apply diagnostic setting
New-AzDiagnosticSetting -Name "Storage-Diagnostics" -ResourceId $storageId -WorkspaceId "/subscriptions/373a9f57-d188-4529-a93b-527fd9acaafa/resourceGroups/DefaultResourceGroup-CCAN/providers/Microsoft.OperationalInsights/workspaces/DefaultWorkspace-373a9f57-d188-4529-a93b-527fd9acaafa-CCAN" -Log $logs -Metric $metrics

## Check VM AMA logs
sudo tail -n 50 /var/log/azure/Microsoft.Azure.Monitor.AzureMonitorLinuxAgent/extension.log

# Access workspace logs and run KQL mode queries

## Get the list of tables

```bash

union withsource=SrcTableName *
| summarize Count = count() by SrcTableName
| sort by Count desc

```

- union * means combine all tables in your Log Analytics workspace.

- withsource=SrcTableName adds a new column named SrcTableName showing which table each row came from.

- Then summarize Count = count() by SrcTableName groups rows by table name and counts them.

```bash

AzureMetrics
| sort by TimeGenerated desc
| take 10

AppAvailabilityResults
| sort by TimeGenerated desc
| take 10

Usage
| sort by TimeGenerated desc
| take 10

```



