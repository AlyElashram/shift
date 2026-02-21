module Api
  module V1
    class StatusesController < BaseController
      before_action :require_super_admin!, except: [ :index ]
      before_action :set_status, only: [ :update, :destroy ]

      def index
        statuses = ShipmentStatus.all
        render json: ShipmentStatusSerializer.new(statuses).serialize
      end

      def create
        status = ShipmentStatus.new(status_params)
        status.order ||= (ShipmentStatus.maximum(:order) || 0) + 1

        if status.save
          render json: { id: status.id }, status: :created
        else
          render_error(status.errors.full_messages.join(", "))
        end
      end

      def update
        if @status.update(status_params)
          render_success
        else
          render_error(@status.errors.full_messages.join(", "))
        end
      end

      def destroy
        if @status.shipments.exists?
          render_error("Cannot delete: #{@status.shipments.count} shipment(s) are using this status")
        else
          @status.destroy!
          render_success
        end
      end

      def reorder
        params[:ids].each_with_index do |id, index|
          ShipmentStatus.where(id: id).update_all(order: index)
        end
        render_success
      end

      private

      def set_status
        @status = ShipmentStatus.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render_not_found
      end

      def status_params
        params.expect(status: [ :name, :description, :order, :is_transit, :notify_email, :color ])
      end
    end
  end
end
