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
      add :program_id, :string
      add :signature, :string
      add :integration_status, :string
      add :proof, :string
      add :email, :string
      add :program_paused, :boolean, default: false

      timestamps(type: :utc_datetime)
    end
  end
end
