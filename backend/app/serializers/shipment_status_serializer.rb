class ShipmentStatusSerializer
  include Alba::Resource

  attributes :id, :name, :description, :order, :is_transit, :notify_email, :color, :created_at, :updated_at
end
