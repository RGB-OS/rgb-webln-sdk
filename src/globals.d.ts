import type { RGBWebLNProvider } from './types';

declare global {
  interface Window {
    rgbwebln?: RGBWebLNProvider;
  }
}

export {};
