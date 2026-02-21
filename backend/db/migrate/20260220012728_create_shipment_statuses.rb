class CreateShipmentStatuses < ActiveRecord::Migration[8.1]
  def change
    create_table :shipment_statuses, id: :string do |t|
      t.string :name, null: false
      t.string :description
      t.integer :order, null: false, default: 0
      t.boolean :is_transit, null: false, default: false
      t.boolean :notify_email, null: false, default: false
      t.string :color

      t.timestamps
    end

    add_index :shipment_statuses, :name, unique: true
  end
end
