defmodule Tossbounty.Bounties do
  @moduledoc """
  The Bounties context.
  """

  import Ecto.Query, warn: false
  alias Tossbounty.Repo

  alias Tossbounty.Bounties.Bounty

  @doc """
  Returns the list of bounties.

  ## Examples

      iex> list_bounties()
      [%Bounty{}, ...]

  """
  def list_bounties do
    Repo.all(Bounty)
  end

  @doc """
  Gets a single bounty.

  Raises `Ecto.NoResultsError` if the Bounty does not exist.

  ## Examples

      iex> get_bounty!(123)
      %Bounty{}

      iex> get_bounty!(456)
      ** (Ecto.NoResultsError)

  """
  def get_bounty!(id), do: Repo.get!(Bounty, id)

  @doc """
  Creates a bounty.

  ## Examples

      iex> create_bounty(%{field: value})
      {:ok, %Bounty{}}

      iex> create_bounty(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_bounty(attrs \\ %{}) do
    %Bounty{}
    |> Bounty.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Evaluates claim for a bounty.

  ## Examples

      iex> evaluate_bounty_claim(%{field: value})
      {:ok, %Bounty{}}

      iex> evaluate_bounty_claim(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def evaluate_bounty_claim(bounty, proof) do
    bounty
    |> Ecto.Changeset.change()
    |> Bounty.evaluate_claim_changeset(proof)
    |> Repo.update()
  end


  @doc """
  Updates a bounty.

  ## Examples

      iex> update_bounty(bounty, %{field: new_value})
      {:ok, %Bounty{}}

      iex> update_bounty(bounty, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_bounty(%Bounty{} = bounty, attrs) do
    bounty
    |> Bounty.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a bounty.

  ## Examples

      iex> delete_bounty(bounty)
      {:ok, %Bounty{}}

      iex> delete_bounty(bounty)
      {:error, %Ecto.Changeset{}}

  """
  def delete_bounty(%Bounty{} = bounty) do
    Repo.delete(bounty)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking bounty changes.

  ## Examples

      iex> change_bounty(bounty)
      %Ecto.Changeset{data: %Bounty{}}

  """
  def change_bounty(%Bounty{} = bounty, attrs \\ %{}) do
    Bounty.changeset(bounty, attrs)
  end

  @doc """
  Get bounty in evaluating claim status using org, description, amount etc...
  """
  def get_bounty_in_evaluating_claim_status(org, description, amount, program_id, funding_account, bump) do
    Repo.one(from(b in Bounty, where: b.org == ^org, where: b.description == ^description, where: b.amount == ^amount, where: b.program_id == ^program_id, where: b.funding_account == ^funding_account, where: b.bump == ^bump, where: b.status == :evaluating_claim))
  end
end
