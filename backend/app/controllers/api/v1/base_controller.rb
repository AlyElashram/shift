module Api
  module V1
    class BaseController < ApplicationController
      before_action :authenticate_request!

      private

      def authenticate_request!
        header = request.headers["Authorization"]
        unless header.present?
          return render json: { error: "Unauthorized" }, status: :unauthorized
        end

        token = header.split(" ").last
        begin
          payload = Warden::JWTAuth::TokenDecoder.new.call(token)
          @current_user = User.find_by(jti: payload["jti"])
          unless @current_user
            render json: { error: "Unauthorized" }, status: :unauthorized
          end
        rescue JWT::DecodeError, JWT::ExpiredSignature
          render json: { error: "Unauthorized" }, status: :unauthorized
        end
      end

      def current_user
        @current_user
      end

      def require_super_admin!
        render json: { error: "Forbidden: Super Admin access required" }, status: :forbidden unless current_user&.super_admin?
      end

      def render_success(data = nil, status: :ok)
        if data.nil?
          render json: { success: true }, status: status
        else
          render json: data, status: status
        end
      end

      def render_error(message, status: :unprocessable_entity)
        render json: { error: message }, status: status
      end

      def render_not_found
        render json: { error: "Not found" }, status: :not_found
      end
    end
  end
end
