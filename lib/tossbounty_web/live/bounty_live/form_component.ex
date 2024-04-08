defmodule TossbountyWeb.BountyLive.FormComponent do
  use TossbountyWeb, :live_component

  alias Tossbounty.Bounties

  @impl true
  def render(assigns) do
    ~H"""
    <div>
      <.simple_form
        for={@form}
        id="bounty-form"
        onsubmit="event.preventDefault()"
      >
        <.input field={@form[:description]} type="text" label="Description" />
        <.input field={@form[:org]} type="text" label="Org" />
        <.input field={@form[:amount]} type="number" label="Amount" />
        <.input field={@form[:program_id]} type="text" label="Program ID" />
        <:actions>
          <.button id="save-bounty-button" phx-hook="SimulateTransaction">Save Bounty</.button>
        </:actions>
      </.simple_form>
    </div>
    """
  end

  @impl true
  def update(%{bounty: bounty} = assigns, socket) do
    changeset = Bounties.change_bounty(bounty)

    {:ok,
     socket
     |> assign(assigns)
     |> assign_form(changeset)}
  end

  @impl true
  def handle_event("validate", %{"bounty" => bounty_params}, socket) do
    changeset =
      socket.assigns.bounty
      |> Bounties.change_bounty(bounty_params)
      |> Map.put(:action, :validate)

    {:noreply, assign_form(socket, changeset)}
  end

  def handle_event("save", %{"bounty" => bounty_params}, socket) do
    save_bounty(socket, socket.assigns.action, bounty_params)
  end

  defp save_bounty(socket, :edit, bounty_params) do
    case Bounties.update_bounty(socket.assigns.bounty, bounty_params) do
      {:ok, bounty} ->
        notify_parent({:saved, bounty})

        {:noreply,
         socket
         |> put_flash(:info, "Bounty updated successfully")
         |> push_patch(to: socket.assigns.patch)}

      {:error, %Ecto.Changeset{} = changeset} ->
        {:noreply, assign_form(socket, changeset)}
    end
  end

  defp save_bounty(socket, :new, bounty_params) do
    case Bounties.create_bounty(bounty_params) do
      {:ok, bounty} ->
        notify_parent({:saved, bounty})

        {:noreply,
         socket
         |> put_flash(:info, "Bounty created successfully")
         |> push_patch(to: socket.assigns.patch)}

      {:error, %Ecto.Changeset{} = changeset} ->
        {:noreply, assign_form(socket, changeset)}
    end
  end

  defp assign_form(socket, %Ecto.Changeset{} = changeset) do
    assign(socket, :form, to_form(changeset))
  end

  defp notify_parent(msg), do: send(self(), {__MODULE__, msg})
end
