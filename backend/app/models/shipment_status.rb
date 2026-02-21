class ShipmentStatus < ApplicationRecord
  include HasStringId

  has_many :shipments, foreign_key: :current_status_id, dependent: :nullify
  has_many :status_histories, class_name: "ShipmentStatusHistory", foreign_key: :status_id, dependent: :destroy

  validates :name, presence: true, uniqueness: true

  default_scope { order(:order) }
end
