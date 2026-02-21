class CreateCarShowcases < ActiveRecord::Migration[8.1]
  def change
    create_table :car_showcases, id: :string do |t|
      t.string :image, null: false
      t.string :model, null: false
      t.string :year, null: false
      t.string :origin, null: false
      t.integer :order, null: false, default: 0
      t.boolean :is_active, null: false, default: true

      t.timestamps
    end
  end
end
