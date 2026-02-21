class Customer < ApplicationRecord
  include HasStringId

  has_many :shipments, dependent: :nullify

  validates :name, presence: true
end
