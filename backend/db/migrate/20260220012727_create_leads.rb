class CreateLeads < ActiveRecord::Migration[8.1]
  def change
    create_table :leads, id: :string do |t|
      t.string :name, null: false
      t.string :email, null: false
      t.string :phone, null: false
      t.string :document_status, null: false
      t.boolean :contacted, null: false, default: false

      t.timestamps
    end
  end
end
