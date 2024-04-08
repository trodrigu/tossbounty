import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface ClaimBountyExampleAccounts {
  authority: PublicKey
  whitehatTokenAccount: PublicKey
  fundingAccount: PublicKey
  bounty: PublicKey
  tokenProgram: PublicKey
  systemProgram: PublicKey
  programId: PublicKey
}

export function claimBountyExample(
  accounts: ClaimBountyExampleAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.authority, isSigner: true, isWritable: true },
    {
      pubkey: accounts.whitehatTokenAccount,
      isSigner: false,
      isWritable: true,
    },
    { pubkey: accounts.fundingAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.bounty, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.programId, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([175, 59, 215, 161, 169, 62, 236, 31])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
