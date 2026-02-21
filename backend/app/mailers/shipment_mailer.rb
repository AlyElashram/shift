class ShipmentMailer < ApplicationMailer
  default from: ENV.fetch("EMAIL_FROM", "SHIFT By Joe <noreply@shiftbyjoe.com>")

  def status_update(shipment, status)
    @shipment = shipment
    @status = status
    @tracking_url = "#{app_url}/track/#{shipment.tracking_id}"

    email_template = Template.find_by(template_type: :email, is_default: true)
    if email_template
      rendered = TemplateRenderer.render(email_template, shipment)
      mail(
        to: shipment.owner_email,
        subject: "Shipment Update: #{shipment.manufacturer} #{shipment.model} - #{status.name}"
      ) { |format| format.html { render html: rendered.html_safe } }
    else
      mail(
        to: shipment.owner_email,
        subject: "Shipment Update: #{shipment.manufacturer} #{shipment.model} - #{status.name}"
      )
    end
  end

  def thank_you(shipment)
    @shipment = shipment
    @tracking_url = "#{app_url}/track/#{shipment.tracking_id}"

    mail(
      to: shipment.owner_email,
      subject: "Thank You for Choosing SHIFT By Joe - #{shipment.manufacturer} #{shipment.model}"
    )
  end

  def custom(shipment, subject, html_content)
    @shipment = shipment

    mail(
      to: shipment.owner_email,
      subject: subject
    ) { |format| format.html { render html: html_content.html_safe } }
  end

  def with_template(shipment, template_name, rendered_html, pdf_attachments = [])
    @shipment = shipment

    pdf_attachments.each do |att|
      attachments[att[:filename]] = {
        mime_type: "application/pdf",
        content: att[:content]
      }
    end

    mail(
      to: shipment.owner_email,
      subject: "#{template_name} - #{shipment.manufacturer} #{shipment.model}"
    ) { |format| format.html { render html: rendered_html.html_safe } }
  end

  private

  def app_url
    ENV.fetch("APP_URL", "http://localhost:5173")
  end
end
