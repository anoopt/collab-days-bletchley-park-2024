using namespace System.Net

# Input bindings are passed in via param block.
param($Request, $TriggerMetadata)

function Get-Summary {

    $content = $Request.Body.content;

    $json = Get-Content -Path "$($PSScriptRoot)\data.json" -Raw
    $json = $json -replace "{{content}}", $content

    $uri = $env:API_Endpoint
    $api_key = $env:API_Key

    $headers = @{
        "Content-Type"  = "application/json"
        "api-key" = $api_key
    }

    $response = Invoke-WebRequest -Uri $uri -Method Post -Headers $headers -Body $json

    if ($response -and $response.StatusCode -eq 200) {
        $summaries = $response.Content | ConvertFrom-Json | Select-Object -ExpandProperty choices | Select-Object -ExpandProperty message | Select-Object -ExpandProperty content | ConvertFrom-Json | Select-Object -ExpandProperty summaries;
        return $summaries | ConvertTo-Json;
    }
    else {
        Write-Host "Error calling API";
        return $null;
    }
}

function main {
    # Write to the Azure Functions log stream.
    Write-Host "PowerShell HTTP trigger function summarise, processed a request."

    $summaries = Get-Summary;

    # Associate values to output bindings by calling 'Push-OutputBinding'.
    Push-OutputBinding -Name Response -Value ([HttpResponseContext]@{
        StatusCode = [HttpStatusCode]::OK
        Body = $summaries
    });
}

main;