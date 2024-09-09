import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { PathConstant } from './constants/path.constant';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authGuardFn } from './guards/auth.guard';

export const routes: Routes = [
  { path: PathConstant.INDEX, component: HomeComponent, pathMatch: 'full' },
  { path: PathConstant.LOGIN, component: LoginComponent },
  { path: PathConstant.REGISTER, component: RegisterComponent },
  {
    path: PathConstant.DASHBOARD,
    component: DashboardComponent,
    canActivate: [authGuardFn],
  },
  { path: '**', redirectTo: PathConstant.INDEX },
];
