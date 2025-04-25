# Series Tracker

A mobile application built with Ionic and Angular that helps users track their TV series watching progress.

## Features

- User Authentication with Supabase
- Add and track TV series
- Upload series cover images
- Track watched episodes
- Responsive design for mobile and desktop

## Technologies Used

- Ionic Framework
- Angular
- Supabase (Backend and Authentication)
- TypeScript

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your Supabase project and update the environment variables in `src/environments/environment.ts`
4. Run the development server:
   ```bash
   ionic serve
   ```

## Environment Setup

Create a Supabase project and add the following to your `environment.ts`:

```typescript
export const environment = {
  production: false,
  supabaseUrl: 'YOUR_SUPABASE_URL',
  supabaseKey: 'YOUR_SUPABASE_KEY'
};
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
