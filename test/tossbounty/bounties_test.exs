defmodule Tossbounty.BountiesTest do
  use Tossbounty.DataCase

  alias Tossbounty.Bounties

  describe "bounties" do
    alias Tossbounty.Bounties.Bounty

    import Tossbounty.BountiesFixtures

    @invalid_attrs %{status: nil, description: nil, org: nil, amount: nil, funding_account: nil, bump: nil, program_id: nil}

    test "list_bounties/0 returns all bounties" do
      bounty = bounty_fixture()
      assert Bounties.list_bounties() == [bounty]
    end

    test "get_bounty!/1 returns the bounty with given id" do
      bounty = bounty_fixture()
      assert Bounties.get_bounty!(bounty.id) == bounty
    end

    test "create_bounty/1 with valid data creates a bounty" do
      valid_attrs = %{status: "some status", description: "some description", org: "some org", amount: 42, funding_account: "some funding_account", bump: 42, program_id: "some program_id"}

      assert {:ok, %Bounty{} = bounty} = Bounties.create_bounty(valid_attrs)
      assert bounty.status == "some status"
      assert bounty.description == "some description"
      assert bounty.org == "some org"
      assert bounty.amount == 42
      assert bounty.funding_account == "some funding_account"
      assert bounty.bump == 42
      assert bounty.program_id == "some program_id"
    end

    test "create_bounty/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Bounties.create_bounty(@invalid_attrs)
    end

    test "update_bounty/2 with valid data updates the bounty" do
      bounty = bounty_fixture()
      update_attrs = %{status: "some updated status", description: "some updated description", org: "some updated org", amount: 43, funding_account: "some updated funding_account", bump: 43, program_id: "some updated program_id"}

      assert {:ok, %Bounty{} = bounty} = Bounties.update_bounty(bounty, update_attrs)
      assert bounty.status == "some updated status"
      assert bounty.description == "some updated description"
      assert bounty.org == "some updated org"
      assert bounty.amount == 43
      assert bounty.funding_account == "some updated funding_account"
      assert bounty.bump == 43
      assert bounty.program_id == "some updated program_id"
    end

    test "update_bounty/2 with invalid data returns error changeset" do
      bounty = bounty_fixture()
      assert {:error, %Ecto.Changeset{}} = Bounties.update_bounty(bounty, @invalid_attrs)
      assert bounty == Bounties.get_bounty!(bounty.id)
    end

    test "delete_bounty/1 deletes the bounty" do
      bounty = bounty_fixture()
      assert {:ok, %Bounty{}} = Bounties.delete_bounty(bounty)
      assert_raise Ecto.NoResultsError, fn -> Bounties.get_bounty!(bounty.id) end
    end

    test "change_bounty/1 returns a bounty changeset" do
      bounty = bounty_fixture()
      assert %Ecto.Changeset{} = Bounties.change_bounty(bounty)
    end
  end
end
