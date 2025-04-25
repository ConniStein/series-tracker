import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
 
})
export class Tab3Page implements OnInit {
  user: User | null = null;
  isEditing = false;
  editableUser: Partial<User> = {};

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.authService.getCurrentUser().subscribe(user => {
      this.user = user;
      this.editableUser = { ...user };
    });
  }

  async updateProfile() {
    if (this.editableUser && Object.keys(this.editableUser).length > 0) {
      try {
        await this.authService.updateProfile(this.editableUser);
        this.isEditing = false;
        this.loadUserProfile();
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }
  }

  async signOut() {
    try {
      await this.authService.signOut();
      // Redirect to login page or handle as needed
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.editableUser = { ...this.user };
    }
  }
}
