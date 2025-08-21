import type { RGBlNProvider } from './types';

declare global {
  interface Window {
    rgbln?: RGBlNProvider;
  }
}

export {};
