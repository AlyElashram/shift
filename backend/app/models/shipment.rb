class Shipment < ApplicationRecord
  include HasStringId

  belongs_to :current_status, class_name: "ShipmentStatus", optional: true
  belongs_to :created_by, class_name: "User", optional: true
  belongs_to :customer, optional: true
  has_many :status_histories, class_name: "ShipmentStatusHistory", dependent: :destroy

  validates :manufacturer, presence: true
  validates :model, presence: true
  validates :vin, presence: true, uniqueness: true
  validates :owner_name, presence: true

  before_create :generate_tracking_id

  private

  def generate_tracking_id
    self.tracking_id ||= SecureRandom.alphanumeric(25)
  end
end
