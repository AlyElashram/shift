class CarShowcase < ApplicationRecord
  include HasStringId

  validates :image, presence: true
  validates :model, presence: true
  validates :year, presence: true
  validates :origin, presence: true

  default_scope { order(:order) }
end
