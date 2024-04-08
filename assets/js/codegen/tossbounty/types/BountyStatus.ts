import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh"

export interface UnclaimedJSON {
  kind: "Unclaimed"
}

export class Unclaimed {
  static readonly discriminator = 0
  static readonly kind = "Unclaimed"
  readonly discriminator = 0
  readonly kind = "Unclaimed"

  toJSON(): UnclaimedJSON {
    return {
      kind: "Unclaimed",
    }
  }

  toEncodable() {
    return {
      Unclaimed: {},
    }
  }
}

export interface ClaimedJSON {
  kind: "Claimed"
}

export class Claimed {
  static readonly discriminator = 1
  static readonly kind = "Claimed"
  readonly discriminator = 1
  readonly kind = "Claimed"

  toJSON(): ClaimedJSON {
    return {
      kind: "Claimed",
    }
  }

  toEncodable() {
    return {
      Claimed: {},
    }
  }
}

export interface CanceledJSON {
  kind: "Canceled"
}

export class Canceled {
  static readonly discriminator = 2
  static readonly kind = "Canceled"
  readonly discriminator = 2
  readonly kind = "Canceled"

  toJSON(): CanceledJSON {
    return {
      kind: "Canceled",
    }
  }

  toEncodable() {
    return {
      Canceled: {},
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.BountyStatusKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("Unclaimed" in obj) {
    return new Unclaimed()
  }
  if ("Claimed" in obj) {
    return new Claimed()
  }
  if ("Canceled" in obj) {
    return new Canceled()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(obj: types.BountyStatusJSON): types.BountyStatusKind {
  switch (obj.kind) {
    case "Unclaimed": {
      return new Unclaimed()
    }
    case "Claimed": {
      return new Claimed()
    }
    case "Canceled": {
      return new Canceled()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], "Unclaimed"),
    borsh.struct([], "Claimed"),
    borsh.struct([], "Canceled"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
