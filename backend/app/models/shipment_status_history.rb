class ShipmentStatusHistory < ApplicationRecord
  include HasStringId

  belongs_to :shipment
  belongs_to :status, class_name: "ShipmentStatus"
  belongs_to :changed_by, class_name: "User", optional: true
end
