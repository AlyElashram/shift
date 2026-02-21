class TemplateRenderer
  PLACEHOLDERS = {
    "ownerName" => ->(s) { s.owner_name },
    "ownerEmail" => ->(s) { s.owner_email },
    "ownerPhone" => ->(s) { s.owner_phone },
    "manufacturer" => ->(s) { s.manufacturer },
    "model" => ->(s) { s.model },
    "vin" => ->(s) { s.vin },
    "year" => ->(s) { s.year },
    "color" => ->(s) { s.color },
    "trackingId" => ->(s) { s.tracking_id },
    "trackingUrl" => ->(s) { "#{ENV.fetch('APP_URL', 'http://localhost:5173')}/track/#{s.tracking_id}" },
    "date" => ->(_) { Date.today.strftime("%B %d, %Y") }
  }.freeze

  def self.render(template_or_content, shipment)
    content = template_or_content.is_a?(Template) ? template_or_content.content : template_or_content
    PLACEHOLDERS.each do |key, resolver|
      content = content.gsub("{{#{key}}}", resolver.call(shipment).to_s)
    end
    content
  end
end
