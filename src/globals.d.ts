import type { RGBlNProvider } from './types';

declare global {
  interface Window {
    rgbwebln?: RGBlNProvider;
  }
}

export {};
