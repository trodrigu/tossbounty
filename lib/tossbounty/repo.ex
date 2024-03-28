defmodule Tossbounty.Repo do
  use Ecto.Repo,
    otp_app: :tossbounty,
    adapter: Ecto.Adapters.SQLite3

end
