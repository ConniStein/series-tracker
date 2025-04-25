import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false
})
export class RegisterPage {
  credentials = {
    email: '',
    password: '',
    confirmPassword: '',
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  async register() {
    if (this.credentials.password !== this.credentials.confirmPassword) {
      const toast = await this.toastCtrl.create({
        message: 'Passwords do not match. Please try again.',
        duration: 3000,
        position: 'bottom',
        color: 'danger'
      });
      await toast.present();
      return;
    }

    try {
      await this.authService.signUp(this.credentials.email, this.credentials.password);
      const toast = await this.toastCtrl.create({
        message: 'Registration successful! Please check your email to verify your account.',
        duration: 5000,
        position: 'bottom',
        color: 'success'
      });
      await toast.present();
      this.router.navigate(['/auth/login']);
    } catch (error: any) {
      let message = 'An unexpected error occurred';
      
      if (error?.message) {
        switch (error.message) {
          case 'User already registered':
            message = 'This email is already registered. Please try logging in.';
            break;
          case 'Password should be at least 6 characters':
            message = 'Password must be at least 6 characters long.';
            break;
          case 'Invalid email':
            message = 'Please enter a valid email address.';
            break;
          default:
            message = error.message;
        }
      }
      
      const toast = await this.toastCtrl.create({
        message: message,
        duration: 3000,
        position: 'bottom',
        color: 'danger'
      });
      await toast.present();
    }
  }
}
