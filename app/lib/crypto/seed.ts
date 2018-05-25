import {Mnemonic} from "./mnemonic"
import {Hash} from "./hash"
import * as assert from "assert"

const bip39 = require("bip39")

export type Seed = {
  masterSecret: Buffer
  chainCode: Buffer
}

export namespace Seed {
  export const deriveSeedFromMnemonics = (mnemonics: string): Seed => {
    if (Mnemonic.validate(mnemonics)) {
      throw new Error("Invalid mnemonic")
    }
    const entropy = bip39.mnemonicToSeed(mnemonics)

    return deriveSeedFromEntropy(entropy)
  }

  export const deriveSeedFromEntropy = (entropy: Buffer): Seed => {
    assert(entropy.length >= 16 && entropy.length <= 64)
    const hash = Hash.sha512hmac(entropy, Buffer.from("Witnet seed"))

    return {
      masterSecret: hash.slice(0, 32),
      chainCode: hash.slice(32, 64)
    }
  }
}