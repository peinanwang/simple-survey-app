class ApplicationController < ActionController::API
  include Pundit::Authorization
  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized

  private

  def authenticate_user!
    token = extract_token
    raise "Missing token" unless token

    @current_user ||= Warden::JWTAuth::UserDecoder.new.call(token, :user, nil)
  rescue => e
    render json: { error: "Unauthorized: #{e.message}" }, status: :unauthorized
  end

  def current_user
    @current_user
  end

  def extract_token
    auth_header = request.headers["Authorization"]
    return nil unless auth_header&.start_with?("Bearer ")
    auth_header.split(" ").last
  end

  def user_not_authorized
    render json: {
      error: "The user is not authorized to perform this action."
    }, status: :forbidden
  end
end
