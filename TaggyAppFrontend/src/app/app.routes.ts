import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { PathConstant } from './constants/path.constant';

export const routes: Routes = [
    {path: PathConstant.HOME, component: HomeComponent, pathMatch: 'full'},
    {path: PathConstant.LOGIN, component: LoginComponent},
    {path: PathConstant.REGISTER, component: RegisterComponent},
    {path: '**', redirectTo: PathConstant.HOME}
];
