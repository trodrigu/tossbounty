defmodule TossbountyWeb.BountyLive.Show do
  use TossbountyWeb, :live_view

  alias Tossbounty.Bounties

  @impl true
  def mount(_params, _session, socket) do
    {:ok, socket}
  end

  @impl true
  def handle_params(%{"id" => id}, _, socket) do
    {:noreply,
     socket
     |> assign(:page_title, page_title(socket.assigns.live_action))
     |> assign(:bounty, Bounties.get_bounty!(id))}
  end

  defp page_title(:show), do: "Show Bounty"
  defp page_title(:edit), do: "Edit Bounty"
end
