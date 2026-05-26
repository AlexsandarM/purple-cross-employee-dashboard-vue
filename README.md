# Purple Cross Ltd - Employee Management Dashboard (Vue)

Vue 3 rebuild of the Purple Cross employee case study.

## Run

```bash
npm install
npm run dev
```

## Tests

Unit tests use [Vitest](https://vitest.dev/) and [@vue/test-utils](https://test-utils.vuejs.org/):

| Area | What is covered |
|------|-----------------|
| `employeeStatus` | Date-based status rules (with fake timers) |
| `employeeValidation` | Required fields, duplicates, edit flow, date rules |
| `dateUtils` | Parsing, sorting, formatting |
| `employeeStorage` | `localStorage` read/write and error handling |
| `useEmployees` | CRUD composable with provide/inject |
| `StatusBadge` | Variant classes and `data-testid` |

```bash
npm test
```

Watch mode while developing:

```bash
npm run test:watch
```

## Git

20 incremental commits on `master`. Push to GitHub:

```bash
git remote add origin https://github.com/YOUR_USER/purple-cross-employee-dashboard-vue.git
git branch -M main
git push -u origin main
```
