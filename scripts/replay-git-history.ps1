# Run from: d:\IWC_work_laptop\IWConnect staging\replay-vue-git-history.ps1
# Rebuilds commit history without deleting this script.

param([switch]$Force)

$ErrorActionPreference = 'Stop'
$Root = Join-Path $PSScriptRoot 'case_stady\purple-cross-employee-dashboard-vue'
$Stubs = Join-Path $Root 'scripts\stubs'

function Find-Git {
  $cmd = Get-Command git -ErrorAction SilentlyContinue
  if ($cmd) { return $cmd.Source }
  $p = 'C:\Program Files\Git\cmd\git.exe'
  if (Test-Path $p) { return $p }
  throw 'Git not found'
}

function Invoke-Git {
  param([Parameter(ValueFromRemainingArguments = $true)][string[]]$GitArguments)
  Push-Location $Root
  try {
    & $script:GitExe @GitArguments
    if ($LASTEXITCODE -ne 0) { throw "git failed: $($GitArguments -join ' ')" }
  } finally {
    Pop-Location
  }
}

function Clear-AppFiles {
  Get-ChildItem -Path $Root -Force |
    Where-Object { $_.Name -notin @('.git', 'scripts') } |
    Remove-Item -Recurse -Force
}

function Copy-File {
  param([string]$Relative, [string]$SourceRoot)
  $s = Join-Path $SourceRoot $Relative
  $t = Join-Path $Root $Relative
  $dir = Split-Path $t -Parent
  if ($dir -and -not (Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
  Copy-Item $s $t -Force
}

function Copy-Stub([string]$Stub, [string]$Target) {
  Copy-Item (Join-Path $Stubs $Stub) (Join-Path $Root $Target) -Force
}

function Apply-Files([string[]]$Files, [string]$Backup) {
  foreach ($f in $Files) { Copy-File $f $Backup }
}

$GitExe = Find-Git

if (-not (Test-Path (Join-Path $Root 'src\pages\EmployeesPage.vue'))) {
  throw "Restore the Vue app source files before running this script."
}

$Backup = Join-Path $env:TEMP "purple-cross-vue-$(Get-Random)"
New-Item -ItemType Directory -Force -Path $Backup | Out-Null
Get-ChildItem $Root -Recurse -File |
  Where-Object { $_.FullName -notmatch '\\\.git(\\|$)' } |
  ForEach-Object {
    $rel = $_.FullName.Substring($Root.Length + 1)
    $dest = Join-Path $Backup $rel
    $d = Split-Path $dest -Parent
    if ($d -and -not (Test-Path $d)) { New-Item -ItemType Directory -Force -Path $d | Out-Null }
    Copy-Item $_.FullName $dest -Force
  }

Set-Location $Root
if ((Test-Path '.git') -and $Force) { Remove-Item -Recurse -Force '.git' }
if (-not (Test-Path '.git')) { Invoke-Git init; Invoke-Git config user.email 'dev@purplecross.local'; Invoke-Git config user.name 'Purple Cross Developer' }

$cumulative = @()
$steps = @(
  @{ m = 'chore: initialize Vue Vite project'; f = @('package.json','vite.config.js','index.html','.gitignore'); a = { Copy-Stub 'main.step1.js' 'src\main.js'; Copy-Stub 'App.step1.vue' 'src\App.vue' } }
  @{ m = 'chore: add project structure and employee data'; f = @('src\routes\paths.js','src\data\employees.json') }
  @{ m = 'feat: add app layout and routing'; f = @('src\router\index.js','src\components\layout\AppLayout.vue','src\components\layout\Navbar.vue','src\pages\NotFoundPage.vue'); a = { Copy-Stub 'styles.step3.css' 'src\styles.css'; Set-Content (Join-Path $Root 'src\main.js') @'
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './styles.css';
createApp(App).use(router).mount('#app');
'@ -Encoding UTF8; Set-Content (Join-Path $Root 'src\App.vue') '<template><RouterView /></template>' -Encoding UTF8 } }
  @{ m = 'feat: add employee state management composable'; f = @('src\composables\useEmployees.js','src\utils\employeeStorage.js','src\App.vue') }
  @{ m = 'feat: add employee status utilities'; f = @('src\utils\dateUtils.js','src\utils\employeeStatus.js') }
  @{ m = 'feat: add employee table with actions'; f = @('src\components\common\StatusBadge.vue','src\components\employees\EmployeeTableActions.vue','src\components\employees\EmployeeTable.vue','src\components\common\PageHeader.vue') }
  @{ m = 'feat: add sorting and pagination'; a = { Copy-Stub 'EmployeesPage.step7.vue' 'src\pages\EmployeesPage.vue' } }
  @{ m = 'feat: add employee search and filters'; f = @('src\components\employees\EmployeeFilters.vue','src\pages\EmployeesPage.vue') }
  @{ m = 'feat: add employee details page'; f = @('src\components\employees\EmployeeDetailsCard.vue','src\pages\EmployeeDetailsPage.vue') }
  @{ m = 'feat: add delete confirmation flow'; f = @('src\components\common\ConfirmDialog.vue'); a = { Copy-Stub 'EmployeesPage.step10.vue' 'src\pages\EmployeesPage.vue' } }
  @{ m = 'fix: handle empty and not found states'; f = @('src\pages\EmployeesPage.vue') }
  @{ m = 'feat: add reusable employee form'; f = @('src\components\employees\EmployeeForm.vue') }
  @{ m = 'feat: add create employee flow'; f = @('src\pages\EmployeeCreatePage.vue') }
  @{ m = 'feat: add edit employee flow'; f = @('src\pages\EmployeeEditPage.vue') }
  @{ m = 'feat: add form validation utilities'; f = @('src\utils\employeeValidation.js') }
  @{ m = 'style: improve responsive dashboard layout'; f = @('src\styles.css') }
  @{ m = 'feat: add snackbar feedback messages'; f = @('src\components\common\ToastMessage.vue','src\pages\EmployeesPage.vue','src\pages\EmployeeDetailsPage.vue') }
  @{ m = 'docs: complete README documentation'; f = @('README.md','COMMITS.md') }
  @{ m = 'refactor: align Vue components with case study structure'; f = @('01_ARCHITECTURE.md','02_CURSOR_IMPLEMENTATION_INSTRUCTIONS.md','03_IMPLEMENTATION_PLAN.md','scripts\replay-git-history.ps1','scripts\stubs\App.step1.vue','scripts\stubs\main.step1.js','scripts\stubs\styles.step3.css','scripts\stubs\EmployeesPage.step7.vue','scripts\stubs\EmployeesPage.step10.vue') }
)

foreach ($step in $steps) {
  if ($step.f) { foreach ($x in $step.f) { if ($cumulative -notcontains $x) { $cumulative += $x } } }
  Clear-AppFiles
  Apply-Files $cumulative $Backup
  if ($step.a) { & $step.a }
  Get-ChildItem $Root -Recurse -File | Where-Object { $_.FullName -notmatch '\\scripts\\' } | ForEach-Object {
    $rel = $_.FullName.Substring($Root.Length + 1)
    if ($cumulative -notcontains $rel) { $cumulative += $rel }
  }
  foreach ($rel in $cumulative) {
    if ($rel -notlike 'scripts*') { Invoke-Git add -- ($rel -replace '\\','/') }
  }
  Invoke-Git commit -m $step.m
  Write-Host "OK: $($step.m)"
}

Clear-AppFiles
Get-ChildItem $Backup -Recurse -File | ForEach-Object {
  $rel = $_.FullName.Substring($Backup.Length + 1)
  Copy-File $rel $Backup
}
Remove-Item -Recurse -Force $Backup
Write-Host 'Done. 19 commits on master.'
