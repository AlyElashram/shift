module Api
  module V1
    class TrackingController < BaseController
      skip_before_action :authenticate_request!

      def show
        shipment = Shipment.includes(:current_status, status_histories: [ :status, :changed_by ])
                           .find_by(tracking_id: params[:tracking_id])

        return render_not_found unless shipment

        statuses = ShipmentStatus.all

        render json: {
          shipment: ShipmentSerializer.new(shipment).to_h,
          statuses: ShipmentStatusSerializer.new(statuses).to_h
        }
      end
    end
  end
end
