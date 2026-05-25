import { createRouter, createWebHistory } from 'vue-router';
import AppLayout from '../components/layout/AppLayout.vue';
import EmployeeCreatePage from '../pages/EmployeeCreatePage.vue';
import EmployeeDetailsPage from '../pages/EmployeeDetailsPage.vue';
import EmployeeEditPage from '../pages/EmployeeEditPage.vue';
import EmployeesPage from '../pages/EmployeesPage.vue';
import NotFoundPage from '../pages/NotFoundPage.vue';
import { APP_PATHS } from '../routes/paths';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: APP_PATHS.home,
      redirect: APP_PATHS.employees,
    },
    {
      path: '/',
      component: AppLayout,
      children: [
        {
          path: 'employees',
          name: 'employees',
          component: EmployeesPage,
        },
        {
          path: 'employees/new',
          name: 'create-employee',
          component: EmployeeCreatePage,
        },
        {
          path: 'employees/:code',
          name: 'employee-details',
          component: EmployeeDetailsPage,
        },
        {
          path: 'employees/:code/edit',
          name: 'edit-employee',
          component: EmployeeEditPage,
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundPage,
    },
  ],
});

export default router;
