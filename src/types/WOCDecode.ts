export interface WOCDecode {
  txid: string
  hash: string
  version: number
  size: number
  locktime: number
  vin: Vin[]
  vout: Vout[]
  hex: string
}

interface Vin {
  txid: string
  vout: number
  scriptSig: ScriptSig
  sequence: number
}

interface ScriptSig {
  asm: string
  hex: string
}

interface Vout {
  value: number
  n: number
  scriptPubKey: ScriptPubKey
}

interface ScriptPubKey {
  asm: string
  hex: string
  reqSigs: number
  type: string
  addresses: string[]
}
