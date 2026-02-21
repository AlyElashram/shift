module Api
  module V1
    class SessionsController < ActionController::API
      def create
        user = User.find_by(email: params.dig(:user, :email))

        if user&.valid_password?(params.dig(:user, :password))
          token = Warden::JWTAuth::UserEncoder.new.call(user, :user, nil).first

          response.headers["Authorization"] = "Bearer #{token}"

          render json: {
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role
            },
            token: token
          }, status: :ok
        else
          render json: { error: "Invalid email or password" }, status: :unauthorized
        end
      end

      def destroy
        header = request.headers["Authorization"]
        if header.present?
          token = header.split(" ").last
          begin
            payload = Warden::JWTAuth::TokenDecoder.new.call(token)
            user = User.find_by(jti: payload["jti"])
            user&.update!(jti: SecureRandom.uuid)
          rescue JWT::DecodeError
            # Token already invalid
          end
          render json: { message: "Logged out" }, status: :ok
        else
          render json: { error: "No active session" }, status: :unauthorized
        end
      end
    end
  end
end
