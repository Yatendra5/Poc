import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  status: 'active' | 'inactive';
  createdAt: Date;
  lastLogin?: Date;
}

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="users-management">
      <div class="page-header">
        <h1>Users Management</h1>
        <p>Manage all platform users and their permissions</p>
      </div>

      <div class="users-controls">
        <div class="search-filter">
          <input 
            type="text" 
            placeholder="Search users by name or email..." 
            [(ngModel)]="searchTerm"
            (input)="filterUsers()"
            class="search-input">
          
          <select [(ngModel)]="roleFilter" (change)="filterUsers()" class="filter-select">
            <option value="">All Roles</option>
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>

          <select [(ngModel)]="statusFilter" (change)="filterUsers()" class="filter-select">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div class="users-stats">
          <span class="stat">Total: {{ filteredUsers.length }}</span>
          <span class="stat">Active: {{ getActiveUsersCount() }}</span>
          <span class="stat">Admins: {{ getAdminUsersCount() }}</span>
        </div>
      </div>

      <div class="users-table" *ngIf="filteredUsers.length > 0; else noUsers">
        <div class="table-header">
          <div class="header-cell">User</div>
          <div class="header-cell">Role</div>
          <div class="header-cell">Status</div>
          <div class="header-cell">Created</div>
          <div class="header-cell">Last Login</div>
          <div class="header-cell">Actions</div>
        </div>

        <div class="table-row" *ngFor="let user of filteredUsers">
          <div class="cell user-info">
            <div class="user-avatar">{{ getUserInitials(user.name) }}</div>
            <div class="user-details">
              <div class="user-name">{{ user.name }}</div>
              <div class="user-email">{{ user.email }}</div>
            </div>
          </div>

          <div class="cell">
            <span class="role-badge" [ngClass]="'role-' + user.role">
              {{ user.role | titlecase }}
            </span>
          </div>

          <div class="cell">
            <span class="status-badge" [ngClass]="'status-' + user.status">
              {{ user.status | titlecase }}
            </span>
          </div>

          <div class="cell">
            {{ user.createdAt | date:'MMM dd, yyyy' }}
          </div>

          <div class="cell">
            {{ user.lastLogin ? (user.lastLogin | date:'MMM dd, yyyy') : 'Never' }}
          </div>

          <div class="cell actions">
            <button class="action-btn" (click)="toggleUserStatus(user)">
              {{ user.status === 'active' ? 'Deactivate' : 'Activate' }}
            </button>
            <button class="action-btn" (click)="toggleUserRole(user)" *ngIf="user.role !== 'admin'">
              Make Admin
            </button>
            <button class="action-btn danger" (click)="deleteUser(user)">
              Delete
            </button>
          </div>
        </div>
      </div>

      <ng-template #noUsers>
        <div class="no-users">
          <div class="no-users-icon">👥</div>
          <h3>No users found</h3>
          <p>Try adjusting your search criteria or filters.</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .users-management {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 2rem;
    }

    .page-header h1 {
      margin: 0 0 0.5rem 0;
      color: #333;
    }

    .page-header p {
      margin: 0;
      color: #666;
    }

    .users-controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .search-filter {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .search-input, .filter-select {
      padding: 0.5rem 1rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 0.9rem;
    }

    .search-input {
      min-width: 250px;
    }

    .users-stats {
      display: flex;
      gap: 1rem;
    }

    .stat {
      font-size: 0.85rem;
      color: #666;
      background: #f8f9fa;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
    }

    .users-table {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      overflow-x: auto;
    }

    .table-header {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1.5fr;
      background: #f8f9fa;
      border-bottom: 1px solid #dee2e6;
      font-weight: 600;
      color: #495057;
    }

    .table-row {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1.5fr;
      border-bottom: 1px solid #dee2e6;
    }

    .table-row:last-child {
      border-bottom: none;
    }

    .header-cell, .cell {
      padding: 1rem;
      display: flex;
      align-items: center;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #007bff;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.85rem;
    }

    .user-details {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .user-name {
      font-weight: 500;
      color: #333;
    }

    .user-email {
      font-size: 0.85rem;
      color: #666;
    }

    .role-badge, .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: uppercase;
    }

    .role-customer {
      background: #e3f2fd;
      color: #1565c0;
    }

    .role-admin {
      background: #fff3e0;
      color: #ef6c00;
    }

    .status-active {
      background: #e8f5e8;
      color: #2e7d32;
    }

    .status-inactive {
      background: #ffebee;
      color: #c62828;
    }

    .actions {
      gap: 0.5rem;
    }

    .action-btn {
      padding: 0.25rem 0.75rem;
      border: 1px solid #ddd;
      background: white;
      border-radius: 4px;
      font-size: 0.75rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .action-btn:hover {
      background: #f8f9fa;
    }

    .action-btn.danger {
      border-color: #dc3545;
      color: #dc3545;
    }

    .action-btn.danger:hover {
      background: #dc3545;
      color: white;
    }

    .no-users {
      text-align: center;
      padding: 4rem 2rem;
      color: #666;
    }

    .no-users-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .no-users h3 {
      margin: 0 0 0.5rem 0;
    }

    .no-users p {
      margin: 0;
    }

    @media (max-width: 768px) {
      .users-controls {
        flex-direction: column;
        align-items: stretch;
      }

      .search-filter {
        justify-content: center;
      }

      .search-input {
        min-width: auto;
        flex: 1;
      }

      .table-header, .table-row {
        grid-template-columns: 1fr;
        gap: 0.5rem;
      }

      .header-cell, .cell {
        padding: 0.5rem 1rem;
      }

      .actions {
        flex-wrap: wrap;
      }
    }
  `]
})
export class UsersListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm: string = '';
  roleFilter: string = '';
  statusFilter: string = '';

  ngOnInit() {
    this.loadUsers();
  }

  private loadUsers() {
    // Mock data - replace with actual API call
    this.users = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@email.com',
        role: 'customer',
        status: 'active',
        createdAt: new Date('2024-01-15'),
        lastLogin: new Date('2024-10-28')
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane.smith@email.com',
        role: 'admin',
        status: 'active',
        createdAt: new Date('2024-02-20'),
        lastLogin: new Date('2024-10-29')
      },
      {
        id: '3',
        name: 'Bob Johnson',
        email: 'bob.johnson@email.com',
        role: 'customer',
        status: 'inactive',
        createdAt: new Date('2024-03-10'),
        lastLogin: new Date('2024-09-15')
      },
      {
        id: '4',
        name: 'Alice Brown',
        email: 'alice.brown@email.com',
        role: 'customer',
        status: 'active',
        createdAt: new Date('2024-04-05'),
        lastLogin: new Date('2024-10-27')
      },
      {
        id: '5',
        name: 'Charlie Wilson',
        email: 'charlie.wilson@email.com',
        role: 'customer',
        status: 'active',
        createdAt: new Date('2024-05-12')
      }
    ];
    this.filteredUsers = [...this.users];
  }

  filterUsers() {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = this.searchTerm === '' || 
        user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesRole = this.roleFilter === '' || user.role === this.roleFilter;
      const matchesStatus = this.statusFilter === '' || user.status === this.statusFilter;
      
      return matchesSearch && matchesRole && matchesStatus;
    });
  }

  getUserInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }

  getActiveUsersCount(): number {
    return this.filteredUsers.filter(user => user.status === 'active').length;
  }

  getAdminUsersCount(): number {
    return this.filteredUsers.filter(user => user.role === 'admin').length;
  }

  toggleUserStatus(user: User) {
    user.status = user.status === 'active' ? 'inactive' : 'active';
    // In a real app, make API call to update user status
    console.log(`User ${user.name} status changed to ${user.status}`);
  }

  toggleUserRole(user: User) {
    user.role = user.role === 'customer' ? 'admin' : 'customer';
    // In a real app, make API call to update user role
    console.log(`User ${user.name} role changed to ${user.role}`);
  }

  deleteUser(user: User) {
    if (confirm(`Are you sure you want to delete user ${user.name}?`)) {
      this.users = this.users.filter(u => u.id !== user.id);
      this.filterUsers();
      // In a real app, make API call to delete user
      console.log(`User ${user.name} deleted`);
    }
  }
}