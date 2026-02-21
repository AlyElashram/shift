module Api
  module V1
    class ShowcasesController < BaseController
      skip_before_action :authenticate_request!, only: [ :public_index ]
      before_action :require_super_admin!, except: [ :public_index ]
      before_action :set_showcase, only: [ :update, :destroy, :toggle_active ]

      def public_index
        showcases = CarShowcase.where(is_active: true).order(:order)
        render json: CarShowcaseSerializer.new(showcases).serialize
      end

      def index
        showcases = CarShowcase.all
        render json: CarShowcaseSerializer.new(showcases).serialize
      end

      def create
        showcase = CarShowcase.new(showcase_params)
        if showcase.save
          render json: { id: showcase.id }, status: :created
        else
          render_error(showcase.errors.full_messages.join(", "))
        end
      end

      def update
        if @showcase.update(showcase_params)
          render_success
        else
          render_error(@showcase.errors.full_messages.join(", "))
        end
      end

      def destroy
        @showcase.destroy!
        render_success
      end

      def toggle_active
        @showcase.update!(is_active: !@showcase.is_active)
        render_success
      end

      def reorder
        params[:ids].each_with_index do |id, index|
          CarShowcase.where(id: id).update_all(order: index)
        end
        render_success
      end

      private

      def set_showcase
        @showcase = CarShowcase.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render_not_found
      end

      def showcase_params
        params.expect(showcase: [ :image, :model, :year, :origin, :order, :is_active ])
      end
    end
  end
end
