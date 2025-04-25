import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { SeriesService } from '../services/series.service';
import { AuthService } from '../services/auth.service';
import { Series } from '../models/series.model';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false
})
export class Tab2Page {
  @ViewChild('fileInput') fileInput!: ElementRef;
  
  newSeries: Series = {
    title: '',
    platform: '',
    totalEpisodes: 0,
    watchedEpisodes: 0,
    user_id: '',
    notes: '',
    imageUrl: ''
  };

  imagePreview: string | null = null;
  selectedFile: File | null = null;

  platforms = [
    'Netflix',
    'Amazon Prime',
    'Disney+',
    'HBO Max',
    'Hulu',
    'Apple TV+',
    'Other'
  ];

  constructor(
    private seriesService: SeriesService,
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {}

  uploadImage() {
    this.fileInput.nativeElement.click();
  }

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  async uploadImageToStorage(file: File, userId: string): Promise<string> {
    try {
      const fileName = `${userId}_${Date.now()}_${file.name}`;
      const { data, error } = await this.seriesService.uploadImage(file, fileName);
      
      if (error) throw error;
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  async onSubmit() {
    if (this.isFormValid()) {
      try {
        const user = await new Promise<{ id: string }>((resolve) => {
          this.authService.getCurrentUser().subscribe((user) => {
            resolve(user as { id: string });
          });
        });

        if (user) {
          this.newSeries.user_id = user.id;

          // Upload image if selected
          if (this.selectedFile) {
            try {
              const imageUrl = await this.uploadImageToStorage(this.selectedFile, user.id);
              this.newSeries.imageUrl = imageUrl;
            } catch (error) {
              await this.showToast('Failed to upload image. Series will be saved without an image.');
            }
          }

          await this.seriesService.addSeries(this.newSeries);
          this.resetForm();
          this.router.navigate(['/tabs/tab1']);
        }
      } catch (error) {
        console.error('Error adding series:', error);
        await this.showToast('Failed to add series. Please try again.');
      }
    }
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }

  isFormValid(): boolean {
    return Boolean(
      this.newSeries.title &&
      this.newSeries.platform &&
      this.newSeries.totalEpisodes > 0
    );
  }

  private resetForm() {
    this.newSeries = {
      title: '',
      platform: '',
      totalEpisodes: 0,
      watchedEpisodes: 0,
      user_id: '',
      notes:'',
      imageUrl: ''
    };
    this.imagePreview = null;
    this.selectedFile = null;
  }
}
