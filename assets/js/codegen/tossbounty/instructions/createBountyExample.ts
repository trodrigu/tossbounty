import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface CreateBountyExampleArgs {
  description: string
  org: string
  amount: BN
  bump: number
}

export interface CreateBountyExampleAccounts {
  authority: PublicKey
  bounty: PublicKey
  fundingAccount: PublicKey
  systemProgram: PublicKey
  programId: PublicKey
}

export const layout = borsh.struct([
  borsh.str("description"),
  borsh.str("org"),
  borsh.u64("amount"),
  borsh.u8("bump"),
])

export function createBountyExample(
  args: CreateBountyExampleArgs,
  accounts: CreateBountyExampleAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.authority, isSigner: true, isWritable: true },
    { pubkey: accounts.bounty, isSigner: false, isWritable: true },
    { pubkey: accounts.fundingAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.programId, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([71, 186, 202, 53, 44, 20, 177, 87])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      description: args.description,
      org: args.org,
      amount: args.amount,
      bump: args.bump,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
