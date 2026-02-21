class ShipmentSerializer
  include Alba::Resource

  attributes :id, :tracking_id, :manufacturer, :model, :vin, :year, :color,
             :pictures, :owner_name, :owner_email, :owner_phone, :notes,
             :current_status_id, :customer_id, :created_at, :updated_at

  one :current_status, resource: ShipmentStatusSerializer, if: proc { |shipment| shipment.association(:current_status).loaded? }
  one :created_by, resource: UserSummarySerializer, if: proc { |shipment| shipment.association(:created_by).loaded? }
  many :status_histories, resource: StatusHistorySerializer, if: proc { |shipment| shipment.association(:status_histories).loaded? }
end
