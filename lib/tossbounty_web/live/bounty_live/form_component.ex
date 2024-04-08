defmodule TossbountyWeb.BountyLive.FormComponent do
  use TossbountyWeb, :live_component

  alias Tossbounty.Bounties
  alias Tossbounty.Accounts.UserNotifier
  alias Tossbounty.Accounts.UserToken
  alias Tossbounty.Repo

  @impl true
  def render(assigns) do
    IO.inspect(assigns)
    ~H"""
    <div>
      <.simple_form
        :if={assigns.action == :new}
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

      <.simple_form
        :if={assigns.action == :claim}
        for={@form}
        id="bounty-form"
        for={@form}
        id="bounty-form"
        phx-target={@myself}
        phx-submit="claim"
      >
        <.input field={@form[:proof]} type="text" label="Proof" />
        <.input field={@form[:token_account]} type="text" label="Token Account" />
        <:actions>
          <.button phx-disable-with="Saving...">Claim Bounty</.button>
        </:actions>
      </.simple_form>

      <.simple_form
        :if={assigns.action == :release}
        for={@form}
        id="bounty-form"
        onsubmit="event.preventDefault()"
      >
        <.input field={@form[:token_account]} type="text" label="White Hat Token Account" value={assigns.token_account} disabled/>
        <.input field={@form[:program_id]} type="text" label="Program ID" value={assigns.bounty.program_id} disabled/>
        <:actions>
          <button class="phx-submit-loading:opacity-75 rounded-lg hover:bg-zinc-700 py-2 px-3 text-sm font-semibold leading-6 text-white active:text-white/80 bg-red-700" id="release-bounty-button-with-pause" phx-hook="ReleaseBountyWithPause" disabled>Release Bounty With Pause</button>
          <.button id="release-bounty-button" phx-hook="ReleaseBounty" disabled>Release Bounty</.button>
          <.button id="connect-wallet-release" phx-hook="ConnectWalletRelease">Connect Wallet</.button>
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
    save_bounty(socket, socket.assigns.action, Map.put(bounty_params, "email", socket.assigns.current_user.email))
  end

  def handle_event("claim", %{"bounty" => bounty_params}, socket) do
    save_bounty(socket, :claim, bounty_params["proof"], bounty_params["token_account"])
  end

  defp save_bounty(socket, :claim, proof, token_account) do
    case Bounties.evaluate_bounty_claim(socket.assigns.bounty, proof) do
      {:ok, bounty} ->
        {encoded_token, user_token} = UserToken.build_email_token(socket.assigns.current_user, "claim")
        Repo.insert!(user_token)
        url = ~p"/bounties/#{encoded_token}/claim/#{token_account}/release/#{bounty.id}"
        UserNotifier.deliver_bounty_creator_evaluation(bounty, proof, url)
        notify_parent({:saved, bounty})

        {:noreply,
         socket
         |> put_flash(:info, "Bounty claim for evaluation submitted successfully")
         |> push_patch(to: socket.assigns.patch)}

      {:error, %Ecto.Changeset{} = changeset} ->
        {:noreply, assign_form(socket, changeset)}
    end
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
