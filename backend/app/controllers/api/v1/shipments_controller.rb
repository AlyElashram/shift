module Api
  module V1
    class ShipmentsController < BaseController
      before_action :set_shipment, only: [ :show, :update, :destroy, :update_status ]

      def index
        shipments = Shipment.includes(:current_status).order(created_at: :desc)
        shipments = shipments.where("manufacturer ILIKE :q OR model ILIKE :q OR vin ILIKE :q OR owner_name ILIKE :q", q: "%#{params[:search]}%") if params[:search].present?
        shipments = shipments.where(current_status_id: params[:status_id]) if params[:status_id].present?
        shipments = shipments.limit(params[:limit]) if params[:limit].present?

        render json: ShipmentSerializer.new(shipments).serialize
      end

      def show
        render json: ShipmentSerializer.new(@shipment).serialize
      end

      def create
        shipment = Shipment.new(shipment_params)
        shipment.created_by = current_user

        if shipment.save
          render json: { id: shipment.id, tracking_id: shipment.tracking_id }, status: :created
        else
          render_error(shipment.errors.full_messages.join(", "))
        end
      end

      def update
        if @shipment.update(shipment_params)
          render_success
        else
          render_error(@shipment.errors.full_messages.join(", "))
        end
      end

      def destroy
        @shipment.destroy!
        render_success
      end

      def update_status
        status = ShipmentStatus.find_by(id: params[:status_id])
        return render_error("Status not found") unless status

        Shipment.transaction do
          @shipment.update!(current_status_id: status.id)
          ShipmentStatusHistory.create!(
            shipment: @shipment,
            status: status,
            changed_by: current_user,
            notes: params[:notes]
          )
        end

        if status.notify_email && @shipment.owner_email.present?
          ShipmentMailer.status_update(@shipment, status).deliver_later
        end

        render_success
      rescue ActiveRecord::RecordInvalid => e
        render_error(e.message)
      end

      private

      def set_shipment
        @shipment = Shipment.includes(:current_status, :created_by, status_histories: [ :status, :changed_by ]).find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render_not_found
      end

      def shipment_params
        params.expect(shipment: [
          :manufacturer, :model, :vin, :year, :color,
          :owner_name, :owner_email, :owner_phone,
          :notes, :current_status_id, :customer_id,
          pictures: []
        ])
      end
    end
  end
end
