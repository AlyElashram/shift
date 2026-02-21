module Api
  module V1
    class DocumentsController < BaseController
      before_action :set_shipment
      before_action :set_template

      def generate
        rendered = TemplateRenderer.render(@template, @shipment)
        pdf = PdfGenerator.generate(rendered)

        filename = pdf_filename(@template.template_type, @shipment.owner_name)

        send_data pdf,
          filename: filename,
          type: "application/pdf",
          disposition: "attachment"
      end

      def send_email
        return render_error("No email address for this shipment") unless @shipment.owner_email.present?

        attachments_data = build_attachments
        rendered_body = TemplateRenderer.render(@template, @shipment)

        ShipmentMailer.with_template(
          @shipment,
          @template.name,
          rendered_body,
          attachments_data
        ).deliver_later

        render_success
      end

      private

      def set_shipment
        @shipment = Shipment.includes(:current_status).find(params[:shipment_id])
      rescue ActiveRecord::RecordNotFound
        render_not_found
      end

      def set_template
        @template = Template.find(params[:template_id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Template not found" }, status: :not_found
      end

      def build_attachments
        return [] unless params[:attach_templates].present?

        params[:attach_templates].filter_map do |template_id|
          tpl = Template.find_by(id: template_id)
          next unless tpl

          rendered = TemplateRenderer.render(tpl, @shipment)
          pdf = PdfGenerator.generate(rendered)
          filename = pdf_filename(tpl.template_type, @shipment.owner_name)

          { filename: filename, content: pdf }
        end
      end

      def pdf_filename(template_type, owner_name)
        type_label = case template_type.to_s
        when "contract" then "Contract"
        when "bill" then "Bill"
        else "Document"
        end
        "#{type_label} - #{owner_name}.pdf"
      end
    end
  end
end
