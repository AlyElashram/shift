class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher

  devise :database_authenticatable, :jwt_authenticatable,
         jwt_revocation_strategy: self

  enum :role, { admin: 0, super_admin: 1 }

  has_many :shipments_created, class_name: "Shipment", foreign_key: :created_by_id, dependent: :nullify
  has_many :status_changes, class_name: "ShipmentStatusHistory", foreign_key: :changed_by_id, dependent: :nullify

  validates :name, presence: true
  validates :email, presence: true, uniqueness: true

  before_create :generate_id

  private

  def generate_id
    self.id ||= SecureRandom.alphanumeric(25)
  end
end
