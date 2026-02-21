class CreateShipmentStatusHistories < ActiveRecord::Migration[8.1]
  def change
    create_table :shipment_status_histories, id: :string do |t|
      t.string :shipment_id, null: false
      t.string :status_id, null: false
      t.string :changed_by_id
      t.text :notes
      t.datetime :changed_at, null: false, default: -> { "CURRENT_TIMESTAMP" }

      t.timestamps
    end

    add_index :shipment_status_histories, :shipment_id
    add_foreign_key :shipment_status_histories, :shipments
    add_foreign_key :shipment_status_histories, :shipment_statuses, column: :status_id
    add_foreign_key :shipment_status_histories, :users, column: :changed_by_id
  end
end
