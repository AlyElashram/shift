class AddUniqueIndexToShipmentsVin < ActiveRecord::Migration[8.1]
  def change
    remove_index :shipments, :vin
    add_index :shipments, :vin, unique: true
  end
end
