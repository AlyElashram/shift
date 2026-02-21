module Api
  module V1
    class DashboardController < BaseController
      def index
        render json: {
          stats: {
            shipment_count: Shipment.count,
            lead_count: Lead.where(contacted: false).count,
            status_count: ShipmentStatus.count
          },
          recent_shipments: ShipmentSerializer.new(
            Shipment.includes(:current_status).order(created_at: :desc).limit(5)
          ).to_h,
          recent_leads: LeadSerializer.new(
            Lead.where(contacted: false).order(created_at: :desc).limit(5)
          ).to_h
        }
      end
    end
  end
end
