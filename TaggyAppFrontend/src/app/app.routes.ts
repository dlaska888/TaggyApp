import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { PathConstant } from './constants/path.constant';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authGuardFn } from './guards/auth.guard';
import { IndexComponent } from './components/index/index.component';
import { FileUploadComponent } from './components/common/file-upload/file-upload.component';

export const routes: Routes = [
  { path: PathConstant.INDEX, component: IndexComponent, pathMatch: 'full' },
  { path: PathConstant.LOGIN, component: LoginComponent },
  { path: PathConstant.REGISTER, component: RegisterComponent },
  { path: PathConstant.FILE_UPLOAD, component: FileUploadComponent },
  { path: PathConstant.DASHBOARD, component: DashboardComponent, canActivate: [authGuardFn] },
  { path: '**', redirectTo: PathConstant.INDEX },
];
