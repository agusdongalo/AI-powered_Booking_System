param(
  [string]$DatabaseName = 'salon_booking',
  [string]$DbUser = 'postgres',
  [string]$HostName = 'localhost',
  [int]$Port = 5432,
  [string]$PsqlPath = 'C:\Program Files\PostgreSQL\18\bin\psql.exe'
)

if (-not (Test-Path $PsqlPath)) {
  throw "psql.exe was not found at $PsqlPath"
}

$securePassword = Read-Host "Enter the PostgreSQL password for $DbUser" -AsSecureString
$plainPassword = [System.Net.NetworkCredential]::new('', $securePassword).Password
$env:PGPASSWORD = $plainPassword

$databaseExists = & $PsqlPath -h $HostName -p $Port -U $DbUser -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname = '$DatabaseName';"

if (-not $databaseExists) {
  & $PsqlPath -h $HostName -p $Port -U $DbUser -d postgres -v ON_ERROR_STOP=1 -c "CREATE DATABASE \"$DatabaseName\";"
}

& $PsqlPath -h $HostName -p $Port -U $DbUser -d $DatabaseName -v ON_ERROR_STOP=1 -f (Join-Path $PSScriptRoot 'schema.sql')
& $PsqlPath -h $HostName -p $Port -U $DbUser -d $DatabaseName -v ON_ERROR_STOP=1 -f (Join-Path $PSScriptRoot 'seed.sql')

Write-Host "Database ready: $DatabaseName"