module Api
  module V1
    class LeadsController < BaseController
      skip_before_action :authenticate_request!, only: [ :create ]
      before_action :set_lead, only: [ :destroy, :mark_contacted, :mark_uncontacted ]

      def index
        leads = Lead.order(created_at: :desc)
        render json: LeadSerializer.new(leads).serialize
      end

      def create
        lead = Lead.new(lead_params)
        if lead.save
          render json: { id: lead.id }, status: :created
        else
          render_error(lead.errors.full_messages.join(", "))
        end
      end

      def destroy
        @lead.destroy!
        render_success
      end

      def bulk_destroy
        Lead.where(id: params[:ids]).destroy_all
        render_success
      end

      def mark_contacted
        @lead.update!(contacted: true)
        render_success
      end

      def mark_uncontacted
        @lead.update!(contacted: false)
        render_success
      end

      private

      def set_lead
        @lead = Lead.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render_not_found
      end

      def lead_params
        params.expect(lead: [ :name, :email, :phone, :document_status ])
      end
    end
  end
end
