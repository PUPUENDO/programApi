import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './login/login';
import { authGuard } from './auth.guard';

export const routes: Routes = [
    { path: '', component: Login },
    { path: 'home', component: Home, canActivate: [authGuard] },
];
