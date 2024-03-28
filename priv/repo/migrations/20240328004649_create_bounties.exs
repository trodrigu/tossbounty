defmodule Tossbounty.Repo.Migrations.CreateBounties do
  use Ecto.Migration

  def change do
    create table(:bounties) do
      add :description, :string
      add :org, :string
      add :amount, :integer
      add :status, :string
      add :funding_account, :string
      add :bump, :integer
      add :example_program_id, :string

      timestamps(type: :utc_datetime)
    end
  end
end
