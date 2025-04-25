import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage {
  credentials = {
    email: '',
    password: ''
  };

  constructor(
    private authService: AuthService,
    private toastCtrl: ToastController
  ) {}

  async login() {
    try {
      await this.authService.signIn(this.credentials.email, this.credentials.password);
    } catch (error: any) {
      let message = 'An unexpected error occurred';
      
      if (error?.message) {
        switch (error.message) {
          case 'Invalid login credentials':
            message = 'Invalid email or password. Please try again.';
            break;
          case 'Email not confirmed':
            message = 'Please verify your email before logging in.';
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
