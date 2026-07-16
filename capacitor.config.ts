import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'br.com.construtora.avancoobras',
  appName: 'Avanço de Obras',
  webDir: 'dist',
  server: { androidScheme: 'https' },
  plugins: {
    Preferences: { group: 'AvancoObras' },
  },
};

export default config;
