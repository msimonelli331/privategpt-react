import { PrivategptApiClient } from 'privategpt-sdk-web';
import { getFullBaseUrl } from '@/lib/utils';

export const checkIsPgptHealthy = async (url: string) => {
  const isHealthy = await PrivategptClient.getInstance(url).health.health();
  return isHealthy.status === 'ok';
};

export class PrivategptClient {
  static instance: PrivategptApiClient;

  static getInstance(url?: string) {
    if (!this.instance) {
      if (!url) {
        throw new Error('PrivategptClient instance not initialized with a url');
      }
      this.instance = new PrivategptApiClient({ environment: url });
    }
    if (url) {
      // Use dynamic protocol detection for the URL
      const dynamicUrl = getFullBaseUrl(url);
      this.instance = new PrivategptApiClient({ environment: dynamicUrl });
    }
    return this.instance;
  }
}