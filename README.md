# RGBlN Provider API Documentation

---

# rgbln.enable()

To begin interacting with RGBlN APIs you'll first need to enable the provider. Calling `rgbln.enable()` will prompt the user for permission to use the wallet capabilities of the browser. After that you are free to call any of the other API methods.

#### Method

```typescript
async function enable(origin?: string): Promise<void>;
```

**Example**

```javascript
if (typeof window.rgbln !== 'undefined') {
  await window.rgbln.enable();
  console.log("RGBlN enabled!");
}
```

---

# rgbln.isEnabled()

Check if the current origin has already been approved to use RGBlN APIs.

#### Method

```typescript
async function isEnabled(): Promise<boolean>;
```

**Example**

```javascript
const approved = await rgbln.isEnabled();
console.log("Approved?", approved);
```

---

# rgbln.getInfo()

Get information about the connected node and which RGBlN methods it supports.

#### Method

```typescript
async function getInfo(): Promise<GetInfoResponse>;
```

#### Response

```typescript
interface GetInfoResponse {
  node: {
    alias: string;
    pubkey: string;
    color?: string;
  };
  methods: string[]; // e.g. "rgbInvoice", "sendAsset"
}
```

**Example**

```javascript
await rgbln.enable();
const info = await rgbln.getInfo();
console.log(info.node.alias, info.methods);
```

---

# rgbln.getAddress()

Request a Bitcoin address from the wallet.

#### Method

```typescript
async function getAddress(): Promise<AddressResponse>;
```

#### Response

```typescript
interface AddressResponse {
  address: string;
}
```

**Example**

```javascript
const { address } = await rgbln.getAddress();
console.log("Receive BTC at:", address);
```

---

# rgbln.rgbInvoice()

Create an RGB invoice for a specific asset and amount.

#### Method

```typescript
async function rgbInvoice(params: RGBInvoiceRequest): Promise<RgbInvoiceResponse>;
```

#### Request

```typescript
interface RGBInvoiceRequest {
  asset_id?: string;
  amount?: number;
  duration_seconds: number;
  min_confirmations: number;
}
```

#### Response

```typescript
interface RgbInvoiceResponse {
  invoice: string;
}
```

**Example**

```javascript
const invoice = await rgbln.rgbInvoice({
  asset_id: 'rgb:icfqnK9y...',
  amount: 42,
  duration_seconds: 900,
  min_confirmations: 1,
});
console.log(invoice.invoice);
```

---

# rgbln.decodeRgbInvoice()

Decode an RGB invoice into its structured details.

#### Method

```typescript
async function decodeRgbInvoice(params: DecodeInvoiceRequest): Promise<InvoiceDecoded>;
```

#### Request

```typescript
interface DecodeInvoiceRequest {
  invoice: string;
}
```

#### Response

```typescript
interface InvoiceDecoded {
  recipient_id: string;
  asset_id: string;
  assignment: Assignment;
  transport_endpoints: string[];
  asset_schema: string;
  network: string;
  expiration_timestamp: number;
}
```

**Example**

```javascript
const decoded = await rgbln.decodeRgbInvoice({ invoice: invoice.invoice });
console.log(decoded.asset_id, decoded.assignment.value);
```

---

# rgbln.sendAsset()

Send an RGB asset to a recipient.

#### Method

```typescript
async function sendAsset(params: SendRGBAsset): Promise<TXIdResponse>;
```

#### Request

```typescript
interface SendRGBAsset {
  recipient_id: string;
  asset_id: string;
  assignment: Assignment;
  transport_endpoints: string[];
  donation: boolean;
  fee_rate: number;
  min_confirmations: number;
  skip_sync: boolean;
}
```

#### Response

```typescript
interface TXIdResponse {
  txid: string;
}
```

**Example**

```javascript
const tx = await rgbln.sendAsset({
  recipient_id: decoded.recipient_id,
  asset_id: decoded.asset_id,
  assignment: decoded.assignment,
  transport_endpoints: decoded.transport_endpoints,
  donation: false,
  fee_rate: 2,
  min_confirmations: 1,
  skip_sync: false,
});
console.log("TXID:", tx.txid);
```

---

# rgbln.listTransfers()

List transfers for a given asset.

#### Method

```typescript
async function listTransfers(params: { assetId: string }): Promise<ListTransfersResponse>;
```

#### Response

```typescript
interface ListTransfersResponse {
  transfers: RgbTransfer[];
}

interface RgbTransfer {
  idx: number;
  created_at: number;
  updated_at: number;
  status: string;
  txid: string;
  recipient_id: string;
}
```

**Example**

```javascript
const transfers = await rgbln.listTransfers({ assetId: 'rgb:icfqnK9y...' });
console.log(transfers.transfers);
```

---

# rgbln.listAssets()

List assets managed by the wallet.

#### Method

```typescript
async function listAssets(): Promise<ListAssetsResponse>;
```

#### Response

```typescript
interface ListAssetsResponse {
  nia: NiaAsset[];
  uda: UdaAsset[];
  cfa: CfaAsset[];
}
```

**Example**

```javascript
const assets = await rgbln.listAssets();
console.log(assets.nia, assets.uda, assets.cfa);
```

---

# rgbln.getNetworkInfo()

Get current network information (network type and block height).

#### Method

```typescript
async function getNetworkInfo(): Promise<NetworkInfoResponse>;
```

#### Response

```typescript
interface NetworkInfoResponse {
  network: string;
  height: number;
}
```

**Example**

```javascript
const net = await rgbln.getNetworkInfo();
console.log(net.network, net.height);
```

---

# rgbln.getBTCBalance()

Get the Bitcoin balance for the wallet.

#### Method

```typescript
async function getBTCBalance(): Promise<BTCBalance>;
```

#### Response

```typescript
interface BTCBalance {
  vanilla: {
    settled: number;
    future: number;
    spendable: number;
  };
  colored: {
    settled: number;
    future: number;
    spendable: number;
  };
}
```

**Example**

```javascript
const bal = await rgbln.getBTCBalance();
console.log("BTC balance:", bal.vanilla.spendable, "sats");
```

---

# Events

Wallets can emit events to notify dapps about changes. Subscribe with `rgbln.on(event, listener)` and unsubscribe with `rgbln.off(event, listener)`.

#### Methods

```typescript
function on(event: string, listener: (payload: any) => void): void;
function off(event: string, listener: (payload: any) => void): void;
```

#### Supported Events

* **`rgbln_ready`** – Provider injected and ready.

  * **Payload**: `{ version: string }`
* **`rgbln_nodeChanged`** – Active node scope changed.

  * **Payload**: `{}` (reserved for future use)
* **`rgbln_networkChanged`** – Network switched (e.g., Testnet → Mainnet).

  * **Payload**: `{ network: 'Mainnet' | 'Testnet' | 'Regtest' }`
* **`rgbln_transferUpdated`** – RGB transfer state progressed.

  * **Payload**: `{ assetId: string; transfer: RgbTransfer }`
* **`rgbln_permissionRevoked`** – User revoked this origin’s permission.

  * **Payload**: `{}`

**Example**

```typescript
const onTransfer = (p: { assetId: string; transfer: RgbTransfer }) => {
  console.log('Transfer update:', p.transfer.status);
};

rgbln.on('rgbln_transferUpdated', onTransfer);

// Later
rgbln.off('rgbln_transferUpdated', onTransfer);
```

---

# Using `rgbln-sdk`

Typed client for working with the injected provider.

## Installation

```bash
npm i rgbln-sdk
```

## Quick Start

```typescript
import { RGBlNClient, waitForRGBlN } from 'rgbln-sdk';

const provider = await waitForRGBlN();
const rgbln = new RGBlNClient(provider);
await rgbln.enable();

const info = await rgbln.getInfo();
const { address } = await rgbln.getAddress();
```

## React Hook Example

```tsx
import { useEffect, useState } from 'react';
import { RGBlNClient, waitForRGBlN } from 'rgbln-sdk';

export function useRgbln() {
  const [client, setClient] = useState<RGBlNClient | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const provider = await waitForRGBlN();
        const rgbln = new RGBlNClient(provider);
        await rgbln.enable();
        setClient(rgbln);
        setReady(true);
      } catch (e) {
        console.error('RGBlN init failed', e);
      }
    })();
  }, []);

  return { client, ready };
}
```

## Raw Request (Forward Compatibility)

```typescript

const state = await rgbln.request('request.listchannels');
```

## TypeScript Types

All request/response interfaces are exported:

```typescript
import type { ListAssetsResponse, SendRGBAsset, InvoiceDecoded } from 'rgbln-sdk';
```

> Tip: Always call `enable()` before making requests that require user consent.
