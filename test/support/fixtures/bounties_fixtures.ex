defmodule Tossbounty.BountiesFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `Tossbounty.Bounties` context.
  """

  @doc """
  Generate a bounty.
  """
  def bounty_fixture(attrs \\ %{}) do
    {:ok, bounty} =
      attrs
      |> Enum.into(%{
        amount: 42,
        bump: 42,
        description: "some description",
        program_id: "some program_id",
        funding_account: "some funding_account",
        org: "some org",
        status: "some status"
      })
      |> Tossbounty.Bounties.create_bounty()

    bounty
  end
end
