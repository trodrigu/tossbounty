defmodule TossbountyWeb.BountyLive.Release do
  use TossbountyWeb, :live_view

  alias Tossbounty.Bounties
  alias Tossbounty.Accounts.UserToken
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
end

