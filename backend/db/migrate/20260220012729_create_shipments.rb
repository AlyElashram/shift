class CreateShipments < ActiveRecord::Migration[8.1]
  def change
    create_table :shipments, id: :string do |t|
      t.string :tracking_id, null: false
      t.string :manufacturer, null: false
      t.string :model, null: false
      t.string :vin, null: false
      t.integer :year
      t.string :color
      t.string :pictures, array: true, default: []
      t.string :owner_name, null: false
      t.string :owner_email
      t.string :owner_phone
      t.string :current_status_id
      t.text :notes
      t.string :created_by_id
      t.string :customer_id

      t.timestamps
    end

    add_index :shipments, :tracking_id, unique: true
    add_index :shipments, :vin
    add_foreign_key :shipments, :shipment_statuses, column: :current_status_id
    add_foreign_key :shipments, :users, column: :created_by_id
    add_foreign_key :shipments, :customers, column: :customer_id
  end
end
