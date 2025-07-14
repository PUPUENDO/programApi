import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  email: string = '';
  password: string = '';
  error: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    this.error = '';
    this.http.get<any[]>('https://68743fcedd06792b9c937143.mockapi.io/api/users').subscribe(users => {
      const user = users.find(u => u.email === this.email && u.password === this.password);
      if (user) {
        localStorage.setItem('isLoggedIn', 'true');
        this.router.navigate(['/home']); // Redirige al home
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
