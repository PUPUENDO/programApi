
import { Component, OnInit } from '@angular/core';
import { Api } from '../service/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-list.html',
  styleUrls: ['./user-list.css']
})
export class UserListComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  search: string = '';

  constructor(private api: Api) {}

  ngOnInit() {
    this.api.getUsers().subscribe(users => {
      this.users = users;
      this.filteredUsers = users;
    });
  }

  filterUsers() {
    const searchLower = this.search.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      user.email.toLowerCase().includes(searchLower) ||
      (user.name && user.name.toLowerCase().includes(searchLower))
    );
  }
}
