class CreateCustomers < ActiveRecord::Migration[8.1]
  def change
    create_table :customers, id: :string do |t|
      t.string :name, null: false
      t.string :email
      t.string :phone

      t.timestamps
    end
  end
end
