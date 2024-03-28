defmodule TossbountyWeb.BountyController do
  use TossbountyWeb, :controller

  def index(conn, _params) do
    render(conn, :index)
  end
end

