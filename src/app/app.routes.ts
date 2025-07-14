import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './login/login';
import { authGuard } from './auth.guard';

import { UserListComponent } from './user/user-list';

export const routes: Routes = [
    { path: '', component: Login },
    { path: 'home', component: Home, canActivate: [authGuard] },
    { path: 'users', component: UserListComponent, canActivate: [authGuard] },
];
