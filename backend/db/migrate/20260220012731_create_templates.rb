class CreateTemplates < ActiveRecord::Migration[8.1]
  def change
    create_table :templates, id: :string do |t|
      t.string :name, null: false
      t.integer :template_type, null: false
      t.text :content, null: false
      t.boolean :is_default, null: false, default: false

      t.timestamps
    end
  end
end
