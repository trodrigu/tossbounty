import * as BountyStatus from "./BountyStatus"

export { BountyStatus }

export type BountyStatusKind =
  | BountyStatus.Unclaimed
  | BountyStatus.Claimed
  | BountyStatus.Canceled
export type BountyStatusJSON =
  | BountyStatus.UnclaimedJSON
  | BountyStatus.ClaimedJSON
  | BountyStatus.CanceledJSON
