defmodule Tossbounty.Bounties.Bounty do
  use Ecto.Schema
  import Ecto.Changeset

  schema "bounties" do
    field :status, Ecto.Enum, values: [:unclaimed, :evaluating_claim, :claimed, :canceled], default: :unclaimed
    field :description, :string
    field :org, :string
    field :amount, :integer
    field :funding_account, :string
    field :bump, :integer
    field :program_id, :string
    field :signature, :string
    field :integration_status, Ecto.Enum, values: [:pending, :approved, :rejected], default: :pending
    field :proof, :string
    field :email, :string

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(bounty, attrs) do
    bounty
    |> cast(attrs, [:description, :org, :amount, :status, :funding_account, :bump, :program_id, :signature, :proof, :email])
    |> validate_required([:description, :org, :amount, :status, :funding_account, :bump, :program_id, :signature, :email])
  end

  def evaluate_claim_changeset(bounty, proof) do
    bounty
    |> put_change(:status, :evaluating_claim)
    |> put_change(:proof, proof)
  end
end
