class Users::SessionsController < Devise::SessionsController
  respond_to :json

  def create
    user = User.find_by(email: params[:user][:email])

    if user&.valid_password?(params[:user][:password])
      sign_in(user)
      token = Warden::JWTAuth::UserEncoder.new.call(user, :user, nil).first

      render json: {
        status: {
          code: 200,
          message: "Logged in successfully.",
          token: token,
          data: {
            user: UserSerializer.new(user).serializable_hash[:data][:attributes]
          }
        }
      }, status: :ok
    else
      render json: {
        status: {
          code: 401,
          message: "Invalid email or password"
        }
      }, status: :unauthorized
    end
  end

  def respond_to_on_destroy
    if request.headers['Authorization'].present?
      jwt_payload = JWT.decode(request.headers['Authorization'].split.last,
                               Rails.application.credentials.devise_jwt_secret_key!).first

      current_user = User.find(jwt_payload['sub'])
    end

    if current_user
      render json: {
        status: 200,
        message: 'Logged out successfully.'
      }, status: :ok
    else
      render json: {
        status: 401,
        message: "Couldn't find an active session."
      }, status: :unauthorized
    end
  end
end
