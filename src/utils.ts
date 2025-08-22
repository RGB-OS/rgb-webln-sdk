import { RGBlNProvider } from "./types";

export function isRGBlNProvider(x: any): x is RGBlNProvider {
    return !!x && typeof x.request === 'function' && typeof x.enable === 'function';
}

export async function waitForRGBlN(timeoutMs = 6000): Promise<RGBlNProvider> {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
        const p = (window as any).rgbln;
        if (isRGBlNProvider(p)) return p;
        await new Promise((r) => setTimeout(r, 50));
    }
    throw new Error('RGBlN provider not found on window within timeout');
}