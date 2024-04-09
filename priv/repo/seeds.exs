# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     Tossbounty.Repo.insert!(%Tossbounty.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

Tossbounty.Repo.insert!(%Tossbounty.Bounties.Bounty{
  status: :unclaimed,
  org: "New LLC",
  description: "Discover any 0 day hacks",
  amount: 1000,
  funding_account: "BpaQ5nkQDRJEFSMXFEdhVMizMGoztXZHcuZA7HLmozN1",
  bump: 254,
  program_id: "wyt78UXHtukcbQsJbRPFGf979jxPMvbEij8qAqNsgUx",
  signature: "2shVzXYnszLfyPYuCWPY6PFuiXiPrRRFmvij5uDdrLVgQnmfzkKL5J2xkXwbHCgtEG4ugjJwER1gN5ZUzkNzzfNW",
  email: "trodriguez91@icloud.com"
})

Tossbounty.Repo.insert!(%Tossbounty.Bounties.Bounty{
  status: :claimed,
  org: "BrainFi",
  description: "Any exploits that lead to loss of funds",
  amount: 1000,
  funding_account: "BpaQ5nkQDRJEFSMXFEdhVMizMGoztXZHcuZA7HLmozN1",
  bump: 255,
  program_id: "GY41EV1W7wiACD77HDq79cs5VMQJpQTXoaoNdiF4HQQ6",
  signature: "3YDwivSz9Ssr177cQWb6Az4S6h17HBt6GewDD9361VQvV2diBYA24wF7aJ7kfB9q6DbVafi8T6Kkh9B5k4F8ewFD",
  email: "trodriguez91@icloud.com"
})
