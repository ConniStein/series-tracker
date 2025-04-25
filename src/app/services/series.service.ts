import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { Series } from '../models/series.model';

@Injectable({
  providedIn: 'root'
})
export class SeriesService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  async getAllSeries(userId: string) {
    console.log('Fetching series for userId:', userId);
    
    // First, let's check what's in the series table
    const { data: allData, error: allError } = await this.supabase
      .from('series')
      .select('*');
    console.log('All series in table:', allData);

    // Now get user's series
    const { data, error } = await this.supabase
      .from('series')
      .select('*')
      .eq('user_id', userId);

    console.log('Supabase response:', { data, error });
    if (error) throw error;
    return data as Series[];
  }

  async addSeries(series: Series) {
    console.log('Adding series:', series);
    const { data, error } = await this.supabase
      .from('series')
      .insert([series])
      .select(); // Add .select() to return the inserted data

    console.log('Add series response:', { data, error });
    if (error) throw error;
    return data;
  }

  async uploadImage(file: File, path: string) {
    const { data, error } = await this.supabase.storage
      .from('series-images')
      .upload(path, file);

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = this.supabase.storage
      .from('series-images')
      .getPublicUrl(path);

    return { data: { publicUrl }, error: null };
  }

  async updateProgress(seriesId: string, watchedEpisodes: number) {
    const { data, error } = await this.supabase
      .from('series')
      .update({ watchedEpisodes })
      .eq('id', seriesId);

    if (error) throw error;
    return data;
  }

  async deleteSeries(seriesId: string) {
    const { error } = await this.supabase
      .from('series')
      .delete()
      .eq('id', seriesId);

    if (error) throw error;
  }
}
