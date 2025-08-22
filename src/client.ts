import { DecodeInvoiceRequest, RGBInvoiceRequest, RGBWebLNProvider, SendRGBAsset } from "./types";

export class RGBWebLNClient {
    constructor(private provider: RGBWebLNProvider = (window as any).rgbwebln) {
        if (!provider) throw new Error('RGB Web LN provider not found');
    }

    enable(origin?: string) { return this.provider.enable(origin); }
    isEnabled() { return this.provider.isEnabled(); }
    request<T>(method: string, params?: any) {
        return this.provider.request<T>(method, params);
    }

    // direct passthroughs
    getInfo() { return this.provider.getInfo(); }
    getAddress() { return this.provider.getAddress(); }
    rgbInvoice(p: RGBInvoiceRequest) { return this.provider.rgbInvoice(p); }
    decodeRgbInvoice(p: DecodeInvoiceRequest) { return this.provider.decodeRgbInvoice(p); }
    sendAsset(p: SendRGBAsset) { return this.provider.sendAsset(p); }
    listTransfers(assetId: string) { return this.provider.listTransfers({ assetId }); }
    listAssets() { return this.provider.listAssets(); }
    getNetworkInfo() { return this.provider.getNetworkInfo(); }
    getBTCBalance() { return this.provider.getBTCBalance(); }
    signMessage(message: string) { return this.provider.signMessage(message); }

    on(e: string, cb: (p: any) => void) { this.provider.on(e, cb); }
    off(e: string, cb: (p: any) => void) { this.provider.off(e, cb); }
}
