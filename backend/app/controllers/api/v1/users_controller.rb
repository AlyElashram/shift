module Api
  module V1
    class UsersController < BaseController
      before_action :require_super_admin!
      before_action :set_user, only: [ :update, :destroy ]

      def index
        users = User.order(created_at: :desc)
        render json: UserSerializer.new(users).serialize
      end

      def create
        if User.exists?(email: user_params[:email])
          return render_error("A user with this email already exists")
        end

        user = User.new(user_params)
        if user.save
          render json: { id: user.id }, status: :created
        else
          render_error(user.errors.full_messages.join(", "))
        end
      end

      def update
        if current_user.id == @user.id && params.dig(:user, :role) && params[:user][:role] != current_user.role
          return render_error("You cannot change your own role")
        end

        update_data = user_update_params.to_h
        if update_data[:password].blank?
          update_data.delete(:password)
          update_data.delete(:password_confirmation)
        end

        if update_data[:email] && User.where.not(id: @user.id).exists?(email: update_data[:email])
          return render_error("A user with this email already exists")
        end

        if @user.update(update_data)
          render_success
        else
          render_error(@user.errors.full_messages.join(", "))
        end
      end

      def destroy
        if current_user.id == @user.id
          return render_error("You cannot delete your own account")
        end

        if @user.shipments_created.exists? || @user.status_changes.exists?
          return render_error("Cannot delete user with associated shipments or status changes")
        end

        @user.destroy!
        render_success
      end

      private

      def set_user
        @user = User.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render_not_found
      end

      def user_params
        params.expect(user: [ :name, :email, :password, :role ])
      end

      def user_update_params
        params.expect(user: [ :name, :email, :password, :role ])
      end
    end
  end
end
