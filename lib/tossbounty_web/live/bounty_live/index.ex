defmodule TossbountyWeb.BountyLive.Index do
  use TossbountyWeb, :live_view

  alias Tossbounty.Bounties
  alias Tossbounty.Bounties.Bounty

  @impl true
  def mount(_params, _session, socket) do
    {:ok, stream(socket, :bounties, Bounties.list_bounties())}
  end

  @impl true
  def handle_params(params, _url, socket) do
    {:noreply, apply_action(socket, socket.assigns.live_action, params)}
  end

  defp apply_action(socket, :edit, %{"id" => id}) do
    socket
    |> assign(:page_title, "Edit Bounty")
    |> assign(:bounty, Bounties.get_bounty!(id))
  end

  defp apply_action(socket, :new, _params) do
    socket
    |> assign(:page_title, "New Bounty")
    |> assign(:bounty, %Bounty{})
  end

  defp apply_action(socket, :index, _params) do
    socket
    |> assign(:page_title, "Listing Bounties")
    |> assign(:bounty, nil)
  end

  @impl true
  def handle_info({TossbountyWeb.BountyLive.FormComponent, {:saved, bounty}}, socket) do
    {:noreply, stream_insert(socket, :bounties, bounty)}
  end

  @impl true
  def handle_event("delete", %{"id" => id}, socket) do
    bounty = Bounties.get_bounty!(id)
    {:ok, _} = Bounties.delete_bounty(bounty)

    {:noreply, stream_delete(socket, :bounties, bounty)}
  end

  @impl true
  def handle_event("wallet_change", %{"wallet" => wallet_public_key}, socket) do
    IO.inspect(wallet_public_key)
    {:noreply, socket}
  end

  @impl true
  def handle_event("create_bounty", %{"wallet" => _wallet, "org" => org, "description" => description, "amount" => amount, "programId" => program_id, "signature" => signature, "fundingAccount" => funding_account, "bump" => bump}, socket) do
    bounty=%{"org" => org, "description" => description, "amount" => amount, "program_id" => program_id, "signature" => signature, "funding_account" => funding_account, "bump" => bump}
    {:ok, _bounty} = Bounties.create_bounty(bounty)
    #{:noreply, socket}
    {:noreply, stream_insert(socket, :bounties, bounty)}
  end
end
