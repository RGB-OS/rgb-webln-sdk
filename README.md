# RGB Web lN Provider API Documentation

---

# rgbwebln.enable()

To begin interacting with rgbwebln APIs you'll first need to enable the provider. Calling `rgbwebln.enable()` will prompt the user for permission to use the wallet capabilities of the browser. After that you are free to call any of the other API methods.

#### Method

```typescript
async function enable(origin?: string): Promise<void>;
```

**Example**

```javascript
if (typeof window.rgbwebln !== 'undefined') {
  await window.rgbwebln.enable();
  console.log("rgbwebln enabled!");
}
```

---

# rgbwebln.isEnabled()

Check if the current origin has already been approved to use rgbwebln APIs.

#### Method

```typescript
async function isEnabled(): Promise<boolean>;
```

**Example**

```javascript
const approved = await rgbwebln.isEnabled();
console.log("Approved?", approved);
```

---

# rgbwebln.getInfo()

Get information about the connected node and which rgbwebln methods it supports.

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
await rgbwebln.enable();
const info = await rgbwebln.getInfo();
console.log(info.node.alias, info.methods);
```

---

# rgbwebln.getAddress()

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
const { address } = await rgbwebln.getAddress();
console.log("Receive BTC at:", address);
```

---

# rgbwebln.rgbInvoice()

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
const invoice = await rgbwebln.rgbInvoice({
  asset_id: 'rgb:icfqnK9y...',
  amount: 42,
  duration_seconds: 900,
  min_confirmations: 1,
});
console.log(invoice.invoice);
```

---

# rgbwebln.decodeRgbInvoice()

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
const decoded = await rgbwebln.decodeRgbInvoice({ invoice: invoice.invoice });
console.log(decoded.asset_id, decoded.assignment.value);
```

---

# rgbwebln.sendAsset()

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
const tx = await rgbwebln.sendAsset({
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

# rgbwebln.listTransfers()

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
const transfers = await rgbwebln.listTransfers({ assetId: 'rgb:icfqnK9y...' });
console.log(transfers.transfers);
```

---

# rgbwebln.listAssets()

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
const assets = await rgbwebln.listAssets();
console.log(assets.nia, assets.uda, assets.cfa);
```

---

# rgbwebln.getNetworkInfo()

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
const net = await rgbwebln.getNetworkInfo();
console.log(net.network, net.height);
```

---

# rgbwebln.getBTCBalance()

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
const bal = await rgbwebln.getBTCBalance();
console.log("BTC balance:", bal.vanilla.spendable, "sats");
```

---

# Events

Wallets can emit events to notify dapps about changes. Subscribe with `rgbwebln.on(event, listener)` and unsubscribe with `rgbwebln.off(event, listener)`.

#### Methods

```typescript
function on(event: string, listener: (payload: any) => void): void;
function off(event: string, listener: (payload: any) => void): void;
```

#### Supported Events

* **`rgbwebln_ready`** – Provider injected and ready.

  * **Payload**: `{ version: string }`
* **`rgbwebln_nodeChanged`** – Active node scope changed.

  * **Payload**: `{}` (reserved for future use)
* **`rgbwebln_networkChanged`** – Network switched (e.g., Testnet → Mainnet).

  * **Payload**: `{ network: 'Mainnet' | 'Testnet' | 'Regtest' }`
* **`rgbwebln_transferUpdated`** – RGB transfer state progressed.

  * **Payload**: `{ assetId: string; transfer: RgbTransfer }`
* **`rgbwebln_permissionRevoked`** – User revoked this origin’s permission.

  * **Payload**: `{}`

**Example**

```typescript
const onTransfer = (p: { assetId: string; transfer: RgbTransfer }) => {
  console.log('Transfer update:', p.transfer.status);
};

rgbwebln.on('rgbwebln_transferUpdated', onTransfer);

// Later
rgbwebln.off('rgbwebln_transferUpdated', onTransfer);
```

---

# Using `rgbwebln-sdk`

Typed client for working with the injected provider.

## Installation

```bash
npm i rgbwebln-sdk
```

## Quick Start

```typescript
import { rgbweblnClient, waitForrgbwebln } from 'rgbwebln-sdk';

const provider = await waitForrgbwebln();
const rgbwebln = new rgbweblnClient(provider);
await rgbwebln.enable();

const info = await rgbwebln.getInfo();
const { address } = await rgbwebln.getAddress();
```

## React Hook Example

```tsx
import { useEffect, useState } from 'react';
import { rgbweblnClient, waitForrgbwebln } from 'rgbwebln-sdk';

export function usergbwebln() {
  const [client, setClient] = useState<rgbweblnClient | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const provider = await waitForrgbwebln();
        const rgbwebln = new rgbweblnClient(provider);
        await rgbwebln.enable();
        setClient(rgbwebln);
        setReady(true);
      } catch (e) {
        console.error('rgbwebln init failed', e);
      }
    })();
  }, []);

  return { client, ready };
}
```

## Raw Request (Forward Compatibility)

```typescript

const state = await rgbwebln.request('request.listchannels');
```

## TypeScript Types

All request/response interfaces are exported:

```typescript
import type { ListAssetsResponse, SendRGBAsset, InvoiceDecoded } from 'rgbwebln-sdk';
```

> Tip: Always call `enable()` before making requests that require user consent.
