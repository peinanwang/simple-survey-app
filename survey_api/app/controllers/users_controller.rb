class UsersController < ApplicationController
  before_action :authenticate_user!

  def index
    unless current_user.admin_role? || current_user.manager_role?
      return render json: { error: "Access denied" }, status: :forbidden
    end

    users = User.all
    render json: users.select(:id, :name, :email)
  end
end
