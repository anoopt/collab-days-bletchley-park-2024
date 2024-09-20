using namespace System.Net

# Input bindings are passed in via param block.
param($Request, $TriggerMetadata)

function Update-Page {

    param(
        [Parameter(Mandatory = $true)]
        [string]$siteUrl,
        [Parameter(Mandatory = $true)]
        [string]$pageItemId,
        [Parameter(Mandatory = $true)]
        [string]$columnName,
        [Parameter(Mandatory = $true)]
        [string]$columnValue
    )

    # If in Azure, use Managed Identity to connect to SharePoint
    # Connect-PnPOnline $siteUrl -ManagedIdentity

    # If debugging locally, use a certificate to connect to SharePoint
    $tenantId = $env:TENANT_ID
    $clientId = $env:CLIENT_ID
    $pfxPath = $env:PFX_PATH
    $pfxPassword = $env:PFX_PASSWORD
    Connect-PnPOnline -Url $siteUrl -ClientId $clientId -Tenant $tenantId -CertificatePath $pfxPath -CertificatePassword (ConvertTo-SecureString $pfxPassword -AsPlainText -Force)

    $item = Get-PnPListItem -List "Site Pages" -Id $pageItemId
    Set-PnPListItem -List "Site Pages" -Identity $pageItemId -Values @{$columnName = $columnValue }
    # publish the page
    $page = Get-PnPPage -Identity $item.FieldValues["FileLeafRef"]
    $page.Publish("Published by Azure Function");

    # Why is this not working?
    # $item.File.Publish("Published by Azure Function");
}

function main {
    # Write to the Azure Functions log stream.
    Write-Host "PowerShell HTTP trigger function updatepage, processed a request."

    $result = "Please pass a pageItemId, siteUrl, columnName and columnValue in the request body";

    $pageItemId = $Request.Body.pageItemId;
    $siteUrl = $Request.Body.siteUrl;
    $columnName = $Request.Body.columnName;
    $columnValue = $Request.Body.columnValue;

    if ($null -ne $pageItemId -and $null -ne $siteUrl -and $null -ne $columnName -and $null -ne $columnValue) {
        Update-Page -siteUrl $siteUrl -pageItemId $pageItemId -columnName $columnName -columnValue $columnValue;
        $result = "Page updated";
    }

    # Associate values to output bindings by calling 'Push-OutputBinding'.
    Push-OutputBinding -Name Response -Value ([HttpResponseContext]@{
            StatusCode = [HttpStatusCode]::OK
            Body       = $result
        });
}

main;