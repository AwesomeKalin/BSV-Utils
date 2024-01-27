export interface WOCTx {
    txid: string
    hash: string
    version: number
    size: number
    locktime: number
    vin: Vin[]
    vout: Vout[]
    blockhash: string
    confirmations: number
    time: number
    blocktime: number
    blockheight: number
  }
  
  interface Vin {
    coinbase: string
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
    isTruncated: boolean
  }
  