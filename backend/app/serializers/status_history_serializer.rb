class StatusHistorySerializer
  include Alba::Resource

  attributes :id, :shipment_id, :status_id, :changed_by_id, :notes, :changed_at, :created_at

  one :status, resource: ShipmentStatusSerializer
  one :changed_by, resource: UserSummarySerializer, if: proc { |h| h.association(:changed_by).loaded? }
end
