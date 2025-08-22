export interface EnableResult {
    node: { alias: string; pubkey: string; color?: string };
    methods: string[];
    permissions: string[];
  }
  
  export interface GetInfoResponse {
    node: { alias: string; pubkey: string; color?: string };
    methods: string[];
  }
  
  export interface AddressResponse { address: string }
  
  export type RGBInvoiceRequest = {
    asset_id?: string;
    amount?: number;            
    duration_seconds: number;
    min_confirmations: number;
  };
  
  export type RgbInvoiceResponse = { invoice: string };
  
  export type DecodeInvoiceRequest = { invoice: string };
  
  export interface Assignment { type: 'Fungible' | string; value: number }
  
  interface InvoiceBase {
    recipient_id: string;
    asset_id: string;
    assignment: Assignment;
    transport_endpoints: string[];
  }
  
  export interface InvoiceDecoded extends InvoiceBase {
    asset_schema: 'Nia' | 'Cfa' | 'Uda' | string;
    network: 'Regtest' | 'Mainnet' | 'Testnet' | string;
    expiration_timestamp: number;
  }
  
  export interface SendRGBAsset extends InvoiceBase {
    donation: boolean;
    fee_rate: number;               // sats/vB
    min_confirmations: number;
    skip_sync: boolean;
  }
  
  export type TXIdResponse = { txid: string };
  
  export interface RgbTransfer {
    idx: number;
    created_at: number;
    updated_at: number;
    status: string;                // 'WaitingCounterparty' | 'WaitingConfirmations' | 'Settled' | 'Failed'
    requested_assignment: { type: string; value: number };
    assignments: Array<{ type: string; value: number }>;
    kind: string;                   // 'Send'|'ReceiveBlind'|'ReceiveWitness'| 'Issuen'
    txid: string;
    recipient_id: string;
    receive_utxo: string;
    change_utxo: string | null;
    expiration: number;
    transport_endpoints: Array<{ endpoint: string; transport_type: string; used: boolean }>;
  }
  
  export enum TransferStatus {
    WAITING_COUNTERPARTY = 0,
    WAITING_CONFIRMATIONS = 1,
    SETTLED = 2,
    FAILED = 3,
  }
  
  export interface ListTransfersResponse { transfers: RgbTransfer[] }
  
  export interface NetworkInfoResponse { network: string; height: number }
  
  export interface BTCBalance {
    vanilla: { settled: number; future: number; spendable: number };
    colored: { settled: number; future: number; spendable: number };
  }
  
  export interface AssetBalance {
    settled: number;
    future: number;
    spendable: number;
    offchain_outbound: number;
    offchain_inbound: number;
  }
  
  export interface AssetMedia { file_path: string; mime: string }
  
  export interface AssetBase {
    asset_id: string;
    name: string;
    details: string;
    precision: number;
    issued_supply: number;
    timestamp: number;
    added_at: number;
    balance: AssetBalance;
    media: AssetMedia;
  }
  
  export interface UdaAttachment { file_path: string; digest: string; mime: string }
  
  export interface UdaToken {
    index: number;
    ticker: string;
    name: string;
    details: string;
    embedded_media: boolean;
    media: AssetMedia;
    attachments: Record<string, UdaAttachment>;
    reserves: boolean;
  }
  
  export interface NiaAsset extends AssetBase { ticker: string }
  export interface UdaAsset extends AssetBase { ticker: string; token: UdaToken }
  export interface CfaAsset extends AssetBase { ticker: string }
  
  export interface ListAssetsResponse {
    nia: NiaAsset[];
    uda: UdaAsset[];
    cfa: CfaAsset[];
  }

  export interface SignMessageResponse {
    signed_message: string;
  }
  
  export interface RGBWebLNProvider {
    enable(origin?: string): Promise<void>;
    isEnabled(): Promise<boolean>;
    request<T = unknown>(method: string, params?:any): Promise<T>;
    getInfo(): Promise<GetInfoResponse>;
    getAddress(): Promise<AddressResponse>;
    rgbInvoice(params: RGBInvoiceRequest): Promise<RgbInvoiceResponse>;
    decodeRgbInvoice(params: DecodeInvoiceRequest): Promise<InvoiceDecoded>;
    sendAsset(params: SendRGBAsset): Promise<TXIdResponse>;
    listTransfers(params: { assetId: string }): Promise<ListTransfersResponse>;
    listAssets(): Promise<ListAssetsResponse>;
    getNetworkInfo(): Promise<NetworkInfoResponse>;
    getBalance(): Promise<BTCBalance>;
    signMessage(message: string): Promise<SignMessageResponse>;
    on(event: string, listener: (payload: any) => void): void;
    off(event: string, listener: (payload: any) => void): void;
  }
  