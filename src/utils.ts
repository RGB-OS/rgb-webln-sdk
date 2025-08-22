import { RGBWebLNProvider } from "./types";

export function isRGBlNProvider(x: any): x is RGBWebLNProvider {
    return !!x && typeof x.request === 'function' && typeof x.enable === 'function';
}

export async function waitForRGBlN(timeoutMs = 6000): Promise<RGBWebLNProvider> {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
        const p = (window as any).rgbwebln;
        if (isRGBlNProvider(p)) return p;
        await new Promise((r) => setTimeout(r, 50));
    }
    throw new Error('RGB Web LN provider not found on window within timeout');
}