class CarShowcaseSerializer
  include Alba::Resource

  attributes :id, :image, :model, :year, :origin, :order, :is_active, :created_at, :updated_at
end
