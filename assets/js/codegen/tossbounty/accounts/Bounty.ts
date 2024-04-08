import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface BountyFields {
  description: string
  org: string
  amount: BN
  status: types.BountyStatusKind
  fundingAccount: PublicKey
  bump: number
  programId: PublicKey
}

export interface BountyJSON {
  description: string
  org: string
  amount: string
  status: types.BountyStatusJSON
  fundingAccount: string
  bump: number
  programId: string
}

export class Bounty {
  readonly description: string
  readonly org: string
  readonly amount: BN
  readonly status: types.BountyStatusKind
  readonly fundingAccount: PublicKey
  readonly bump: number
  readonly programId: PublicKey

  static readonly discriminator = Buffer.from([
    237, 16, 105, 198, 19, 69, 242, 234,
  ])

  static readonly layout = borsh.struct([
    borsh.str("description"),
    borsh.str("org"),
    borsh.u64("amount"),
    types.BountyStatus.layout("status"),
    borsh.publicKey("fundingAccount"),
    borsh.u8("bump"),
    borsh.publicKey("programId"),
  ])

  constructor(fields: BountyFields) {
    this.description = fields.description
    this.org = fields.org
    this.amount = fields.amount
    this.status = fields.status
    this.fundingAccount = fields.fundingAccount
    this.bump = fields.bump
    this.programId = fields.programId
  }

  static async fetch(
    c: Connection,
    address: PublicKey,
    programId: PublicKey = PROGRAM_ID
  ): Promise<Bounty | null> {
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
  ): Promise<Array<Bounty | null>> {
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

  static decode(data: Buffer): Bounty {
    if (!data.slice(0, 8).equals(Bounty.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = Bounty.layout.decode(data.slice(8))

    return new Bounty({
      description: dec.description,
      org: dec.org,
      amount: dec.amount,
      status: types.BountyStatus.fromDecoded(dec.status),
      fundingAccount: dec.fundingAccount,
      bump: dec.bump,
      programId: dec.programId,
    })
  }

  toJSON(): BountyJSON {
    return {
      description: this.description,
      org: this.org,
      amount: this.amount.toString(),
      status: this.status.toJSON(),
      fundingAccount: this.fundingAccount.toString(),
      bump: this.bump,
      programId: this.programId.toString(),
    }
  }

  static fromJSON(obj: BountyJSON): Bounty {
    return new Bounty({
      description: obj.description,
      org: obj.org,
      amount: new BN(obj.amount),
      status: types.BountyStatus.fromJSON(obj.status),
      fundingAccount: new PublicKey(obj.fundingAccount),
      bump: obj.bump,
      programId: new PublicKey(obj.programId),
    })
  }
}
