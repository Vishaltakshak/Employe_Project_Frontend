import { Routes } from '@angular/router';
import { EmployeeComponent } from './pages/employee/employee.component';
import { DepartmentComponent } from './pages/department/department.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';

export const routes: Routes = [
  { path: '', redirectTo: 'employee', pathMatch: 'full' },
  {path: 'employee', loadComponent: ()=> import('./pages/employee/employee.component').then(m => m.EmployeeComponent)},
  // { path: 'employee', component: EmployeeComponent },
  {path: 'department', loadComponent: ()=> import('./pages/department/department.component').then(m=> m.DepartmentComponent)},
  // { path: 'department', component: DepartmentComponent },
  { path: 'project', component: ProjectsComponent },
  { path: '**', component: PageNotFoundComponent }
];
