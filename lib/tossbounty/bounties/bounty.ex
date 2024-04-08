defmodule Tossbounty.Bounties.Bounty do
  use Ecto.Schema
  import Ecto.Changeset

  schema "bounties" do
    field :status, Ecto.Enum, values: [:unclaimed, :claimed, :canceled], default: :unclaimed
    field :description, :string
    field :org, :string
    field :amount, :integer
    field :funding_account, :string
    field :bump, :integer
    field :program_id, :string
    field :signature, :string
    field :integration_status, Ecto.Enum, values: [:pending, :approved, :rejected], default: :pending

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(bounty, attrs) do
    bounty
    |> cast(attrs, [:description, :org, :amount, :status, :funding_account, :bump, :program_id, :signature])
    |> validate_required([:description, :org, :amount, :status, :funding_account, :bump, :program_id, :signature])
  end
end
