defmodule TossbountyWeb.BountyLive.Release do
  use TossbountyWeb, :live_view

  alias Tossbounty.Accounts.UserToken
  alias Tossbounty.Bounties
  alias Tossbounty.Bounties.Bounty
  alias Tossbounty.Repo

  @impl true
  def mount(_params, _session, socket) do
    {:ok, socket}
  end

  @impl true
  def handle_params(%{"token" => token, "token_account" => token_account, "id" => id}, url, socket) do
    {:ok, query} = UserToken.verify_email_token_query(token, "confirm")
    user = Repo.one(query)

    {:noreply,
    socket
    |> assign(:claiming_user, user)
    |> assign(:token_account, token_account)
    |> assign(:page_title, "Release Bounty")
    |> assign(:bounty, Bounties.get_bounty!(id))
    }
  end

  @impl true
  def handle_event(
        "claim_bounty",
        %{
          "org" => org,
          "description" => description,
          "amount" => amount,
          "programId" => program_id,
          "fundingAccount" => funding_account,
          "bump" => bump,
          "paused" => paused
        },
        socket
      ) do

    bounty = Bounties.get_bounty_in_evaluating_claim_status(org, description, amount, program_id, funding_account, bump)
    case bounty 
    |> Bounties.change_bounty(%{})
    |> Bounty.claimed_changeset()
    |> then(fn changeset ->
      if paused do
        changeset |> Bounty.pause_changeset()
      else
        changeset
      end
    end)
    |> Repo.update() do
      {:ok, _bounty} -> {:noreply, push_navigate(socket, to: ~p"/bounties")}

      {:error, _changeset} -> {:noreply, socket}
    end
  end
end

