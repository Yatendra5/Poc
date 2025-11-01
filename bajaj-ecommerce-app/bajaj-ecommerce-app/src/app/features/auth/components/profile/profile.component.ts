import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { User, Address } from '../../../../shared/models/user';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  currentUser: User | null = null;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^\+?[\d\s\-\(\)]+$/)]]
    });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.profileForm.patchValue({
          name: user.name,
          email: user.email,
          phone: user.phone || ''
        });
      }
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const updateData = {
      name: this.profileForm.get('name')?.value,
      phone: this.profileForm.get('phone')?.value || undefined
    };

    this.authService.updateProfile(updateData).subscribe({
      next: (user) => {
        this.isLoading = false;
        this.successMessage = 'Profile updated successfully!';
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Failed to update profile';
      }
    });
  }

  get f() { 
    return this.profileForm.controls; 
  }
}