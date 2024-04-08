import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface ExampleStateFields {
  paused: boolean
}

export interface ExampleStateJSON {
  paused: boolean
}

export class ExampleState {
  readonly paused: boolean

  static readonly discriminator = Buffer.from([
    67, 35, 25, 70, 164, 172, 32, 121,
  ])

  static readonly layout = borsh.struct([borsh.bool("paused")])

  constructor(fields: ExampleStateFields) {
    this.paused = fields.paused
  }

  static async fetch(
    c: Connection,
    address: PublicKey,
    programId: PublicKey = PROGRAM_ID
  ): Promise<ExampleState | null> {
    const info = await c.getAccountInfo(address)

    if (info === null) {
      return null
    }
    if (!info.owner.equals(programId)) {
      throw new Error("account doesn't belong to this program")
    }

    return this.decode(info.data)
  }

  static async fetchMultiple(
    c: Connection,
    addresses: PublicKey[],
    programId: PublicKey = PROGRAM_ID
  ): Promise<Array<ExampleState | null>> {
    const infos = await c.getMultipleAccountsInfo(addresses)

    return infos.map((info) => {
      if (info === null) {
        return null
      }
      if (!info.owner.equals(programId)) {
        throw new Error("account doesn't belong to this program")
      }

      return this.decode(info.data)
    })
  }

  static decode(data: Buffer): ExampleState {
    if (!data.slice(0, 8).equals(ExampleState.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = ExampleState.layout.decode(data.slice(8))

    return new ExampleState({
      paused: dec.paused,
    })
  }

  toJSON(): ExampleStateJSON {
    return {
      paused: this.paused,
    }
  }

  static fromJSON(obj: ExampleStateJSON): ExampleState {
    return new ExampleState({
      paused: obj.paused,
    })
  }
}
