import { Component, OnInit } from '@angular/core';
import { SeriesService } from '../services/series.service';
import { AuthService } from '../services/auth.service';
import { Series } from '../models/series.model';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit {
  series: Series[] = [];
  
  constructor(
    private seriesService: SeriesService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadSeries();
  }

  ionViewWillEnter() {
    this.loadSeries(); // Reload data when entering the page
  }

  async loadSeries() {
    this.authService.getCurrentUser().subscribe(async (user) => {
      console.log('Current user in Tab1:', user);
      if (user) {
        try {
          this.series = await this.seriesService.getAllSeries(user.id);
          console.log('Series loaded in Tab1:', this.series);
        } catch (error) {
          console.error('Error loading series:', error);
        }
      } else {
        console.log('No user logged in');
      }
    });
  }

  getProgress(series: Series): number {
    return Math.round((series.watchedEpisodes / series.totalEpisodes) * 100);
  }

  async updateProgress(series: Series) {
    try {
      await this.seriesService.updateProgress(series.id!, series.watchedEpisodes);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  }

  async doRefresh(event: any) {
    await this.loadSeries();
    event.target.complete();
  }

  async addTestSeries() {
    this.authService.getCurrentUser().subscribe(async (user) => {
      if (user) {
        try {
          const testSeries: Series = {
            title: 'Test Series',
            platform: 'Netflix',
            totalEpisodes: 10,
            watchedEpisodes: 0,
            notes: '',
            user_id: user.id,
            imageUrl: 'https://via.placeholder.com/300x450'
          };

          await this.seriesService.addSeries(testSeries);
          await this.loadSeries(); // Reload the series list
        } catch (error) {
          console.error('Error adding test series:', error);
        }
      }
    });
  }
}
