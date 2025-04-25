import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient;
  private currentUser = new BehaviorSubject<User | null>(null);

  constructor(
    private router: Router
  ) {
    // Note: You'll need to add SUPABASE_URL and SUPABASE_KEY to your environment.ts file
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    
    // Check for existing session
    this.loadUser();
  }

  async signUp(email: string, password: string) {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;

      if (data.user) {
        // Create user profile
        const { error: profileError } = await this.supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              email,
              created_at: new Date().toISOString()
            },
          ]);

        if (profileError) throw profileError;
      }

      return data;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  }

  async signIn(email: string, password: string) {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;

      await this.loadUser();
      await this.router.navigate(['/tabs/tab1']);
      return data;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  async signOut() {
    await this.supabase.auth.signOut();
    this.currentUser.next(null);
  }

  getCurrentUser() {
    return this.currentUser.asObservable();
  }

  private async loadUser() {
    const { data } = await this.supabase.auth.getSession();
    if (data.session?.user) {
      const { data: profile } = await this.supabase
        .from('profiles')
        .select('*')
        .eq('id', data.session.user.id)
        .single();

      if (profile) {
        this.currentUser.next(profile as User);
      }
    }
  }

  async updateProfile(profile: Partial<User>) {
    const { data: currentSession } = await this.supabase.auth.getSession();
    if (!currentSession.session?.user) throw new Error('No user logged in');

    const { data, error } = await this.supabase
      .from('profiles')
      .update(profile)
      .eq('id', currentSession.session.user.id);

    if (error) throw error;
    await this.loadUser();
    return data;
  }
}
