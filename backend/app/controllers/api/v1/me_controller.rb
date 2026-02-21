module Api
  module V1
    class MeController < BaseController
      def show
        render json: {
          user: {
            id: current_user.id,
            email: current_user.email,
            name: current_user.name,
            role: current_user.role
          }
        }
      end
    end
  end
end
