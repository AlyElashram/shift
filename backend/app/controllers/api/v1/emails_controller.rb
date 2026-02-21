module Api
  module V1
    class EmailsController < BaseController
      before_action :set_shipment

      def status_update
        return render_error("No email address for this shipment") unless @shipment.owner_email.present?
        return render_error("No status set for this shipment") unless @shipment.current_status.present?

        ShipmentMailer.status_update(@shipment, @shipment.current_status).deliver_later
        render_success
      end

      def thank_you
        return render_error("No email address for this shipment") unless @shipment.owner_email.present?

        ShipmentMailer.thank_you(@shipment).deliver_later
        render_success
      end

      def custom
        return render_error("No email address for this shipment") unless @shipment.owner_email.present?

        ShipmentMailer.custom(@shipment, params[:subject], params[:html_content]).deliver_later
        render_success
      end

      private

      def set_shipment
        @shipment = Shipment.includes(:current_status).find(params[:shipment_id])
      rescue ActiveRecord::RecordNotFound
        render_not_found
      end
    end
  end
end
