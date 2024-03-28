defmodule Tossbounty.Bounties.Bounty do
  use Ecto.Schema
  import Ecto.Changeset

  schema "bounties" do
    field :status, :string
    field :description, :string
    field :org, :string
    field :amount, :integer
    field :funding_account, :string
    field :bump, :integer
    field :example_program_id, :string

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(bounty, attrs) do
    bounty
    |> cast(attrs, [:description, :org, :amount, :status, :funding_account, :bump, :example_program_id])
    |> validate_required([:description, :org, :amount, :status, :funding_account, :bump, :example_program_id])
  end
end
