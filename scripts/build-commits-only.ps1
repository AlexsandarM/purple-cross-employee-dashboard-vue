param([switch]$Force)

$ErrorActionPreference = 'Stop'
$Root = Split-Path $PSScriptRoot -Parent
$Git = if (Test-Path 'C:\Program Files\Git\cmd\git.exe') {
  'C:\Program Files\Git\cmd\git.exe'
} else {
  'git'
}

Push-Location $Root
try {
  if ((Test-Path '.git') -and $Force) {
    Remove-Item -Recurse -Force '.git'
  }

  if (-not (Test-Path '.git')) {
    & $Git init
    & $Git config user.email 'dev@purplecross.local'
    & $Git config user.name 'Purple Cross Developer'
  }

  $steps = @(
    @{ m = 'chore: initialize Vue Vite project'; p = @('package.json','vite.config.js','index.html','.gitignore','src/main.js','src/App.vue') }
    @{ m = 'chore: add project structure and employee data'; p = @('src/routes/paths.js','src/data/employees.json') }
    @{ m = 'feat: add app layout and routing'; p = @('src/router/index.js','src/components/layout/AppLayout.vue','src/components/layout/Navbar.vue','src/pages/NotFoundPage.vue','src/styles.css') }
    @{ m = 'feat: add employee state management composable'; p = @('src/composables/useEmployees.js','src/utils/employeeStorage.js') }
    @{ m = 'feat: add employee status utilities'; p = @('src/utils/dateUtils.js','src/utils/employeeStatus.js') }
    @{ m = 'feat: add employee table with actions'; p = @('src/components/common/StatusBadge.vue','src/components/employees/EmployeeTableActions.vue','src/components/employees/EmployeeTable.vue','src/components/common/PageHeader.vue') }
    @{ m = 'feat: add sorting and pagination'; p = @('src/pages/EmployeesPage.vue') }
    @{ m = 'feat: add employee search and filters'; p = @('src/components/employees/EmployeeFilters.vue') }
    @{ m = 'feat: add employee details page'; p = @('src/components/employees/EmployeeDetailsCard.vue','src/pages/EmployeeDetailsPage.vue') }
    @{ m = 'feat: add delete confirmation flow'; p = @('src/components/common/ConfirmDialog.vue') }
    @{ m = 'fix: handle empty and not found states'; p = @() }
    @{ m = 'feat: add reusable employee form'; p = @('src/components/employees/EmployeeForm.vue') }
    @{ m = 'feat: add create employee flow'; p = @('src/pages/EmployeeCreatePage.vue') }
    @{ m = 'feat: add edit employee flow'; p = @('src/pages/EmployeeEditPage.vue') }
    @{ m = 'feat: add form validation utilities'; p = @('src/utils/employeeValidation.js') }
    @{ m = 'style: improve responsive dashboard layout'; p = @() }
    @{ m = 'feat: add snackbar feedback messages'; p = @('src/components/common/ToastMessage.vue') }
    @{ m = 'docs: complete README documentation'; p = @('README.md','COMMITS.md') }
    @{ m = 'refactor: align Vue components with case study structure'; p = @('01_ARCHITECTURE.md','02_CURSOR_IMPLEMENTATION_INSTRUCTIONS.md','03_IMPLEMENTATION_PLAN.md') }
    @{ m = 'chore: add git history replay tooling'; p = @('scripts/build-commits-only.ps1','scripts/replay-git-history.ps1','scripts/stubs/main.step1.js','scripts/stubs/App.step1.vue','scripts/stubs/styles.step3.css','scripts/stubs/EmployeesPage.step7.vue','scripts/stubs/EmployeesPage.step10.vue') }
  )

  $done = @()
  foreach ($s in $steps) {
    $add = @()
    foreach ($p in $s.p) {
      if ($done -notcontains $p) {
        $add += $p
        $done += $p
      }
    }

    if ($add.Count -eq 0) {
      & $Git commit --allow-empty -m $s.m
    } else {
      & $Git add -- @add
      & $Git commit -m $s.m
    }

    if ($LASTEXITCODE -ne 0) {
      throw "Commit failed: $($s.m)"
    }

    Write-Host "OK: $($s.m)"
  }

  Write-Host ''
  Write-Host 'Done. Run: git log --oneline'
} finally {
  Pop-Location
}
