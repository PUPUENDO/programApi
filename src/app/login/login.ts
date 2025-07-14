
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Api } from '../service/api';

import { UserComponent } from '../user/user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, UserComponent],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  email: string = '';
  password: string = '';
  error: string = '';
  user: any = null;

  constructor(private api: Api, private router: Router) {}

  login() {
    this.error = '';
    this.api.getUsers().subscribe(users => {
      const user = users.find((u: any) => u.email === this.email && u.password === this.password);
      if (user) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify(user));
        this.user = user;
        this.router.navigate(['/home']);
      } else {
        this.error = 'Correo o contraseña incorrectos';
        console.log(this.error);
      }
    }, err => {
      this.error = 'Error al conectar con la API';
      console.log(this.error);
    });
  }
}
