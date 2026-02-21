module Api
  module V1
    class TemplatesController < BaseController
      before_action :require_super_admin!
      before_action :set_template, only: [ :show, :update, :destroy ]

      def index
        templates = Template.order(created_at: :desc)
        render json: TemplateSerializer.new(templates).serialize
      end

      def show
        render json: TemplateSerializer.new(@template).serialize
      end

      def create
        template = Template.new(template_params)

        if template.is_default
          Template.where(template_type: template.template_type, is_default: true).update_all(is_default: false)
        end

        if template.save
          render json: { id: template.id }, status: :created
        else
          render_error(template.errors.full_messages.join(", "))
        end
      end

      def update
        if template_params[:is_default] == true || template_params[:is_default] == "true"
          Template.where(template_type: @template.template_type, is_default: true)
                  .where.not(id: @template.id)
                  .update_all(is_default: false)
        end

        if @template.update(template_params)
          render_success
        else
          render_error(@template.errors.full_messages.join(", "))
        end
      end

      def destroy
        @template.destroy!
        render_success
      end

      def preview
        sample_shipment = OpenStruct.new(
          owner_name: "Ahmed Hassan",
          owner_email: "ahmed@example.com",
          owner_phone: "+20 123 456 7890",
          manufacturer: "Toyota",
          model: "Land Cruiser",
          vin: "JTDKN3DU1A1234567",
          year: "2024",
          color: "Pearl White",
          tracking_id: "sample-tracking-id"
        )

        content = params[:content] || ""
        rendered = TemplateRenderer.render(content, sample_shipment)

        render json: { preview: rendered }
      end

      private

      def set_template
        @template = Template.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render_not_found
      end

      def template_params
        params.expect(template: [ :name, :template_type, :content, :is_default ])
      end
    end
  end
end
