# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_02_21_011425) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  # Custom types defined in this database.
  # Note that some types may not work with other database engines. Be careful if changing database.
  create_enum "TemplateType", ["CONTRACT", "BILL", "EMAIL"]
  create_enum "UserRole", ["ADMIN", "SUPER_ADMIN"]

  create_table "CarShowcase", id: :text, force: :cascade do |t|
    t.datetime "createdAt", precision: 3, default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.text "image", null: false
    t.boolean "isActive", default: true, null: false
    t.text "model", null: false
    t.integer "order", default: 0, null: false
    t.text "origin", null: false
    t.datetime "updatedAt", precision: 3, null: false
    t.text "year", null: false
  end

  create_table "Customer", id: :text, force: :cascade do |t|
    t.datetime "createdAt", precision: 3, default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.text "email"
    t.text "name", null: false
    t.text "phone"
    t.datetime "updatedAt", precision: 3, null: false
  end

  create_table "Lead", id: :text, force: :cascade do |t|
    t.boolean "contacted", default: false, null: false
    t.datetime "createdAt", precision: 3, default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.text "documentStatus", null: false
    t.text "email", null: false
    t.text "name", null: false
    t.text "phone", null: false
  end

  create_table "Shipment", id: :text, force: :cascade do |t|
    t.text "color"
    t.datetime "createdAt", precision: 3, default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.text "createdById"
    t.text "currentStatusId"
    t.text "customerId"
    t.text "manufacturer", null: false
    t.text "model", null: false
    t.text "notes"
    t.text "ownerEmail"
    t.text "ownerName", null: false
    t.text "ownerPhone"
    t.text "pictures", array: true
    t.text "trackingId", null: false
    t.datetime "updatedAt", precision: 3, null: false
    t.text "vin", null: false
    t.integer "year"
    t.index ["trackingId"], name: "Shipment_trackingId_idx"
    t.index ["trackingId"], name: "Shipment_trackingId_key", unique: true
    t.index ["vin"], name: "Shipment_vin_idx"
  end

  create_table "ShipmentStatus", id: :text, force: :cascade do |t|
    t.text "color"
    t.datetime "createdAt", precision: 3, default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.text "description"
    t.boolean "isTransit", default: false, null: false
    t.text "name", null: false
    t.boolean "notifyEmail", default: false, null: false
    t.integer "order", default: 0, null: false
    t.datetime "updatedAt", precision: 3, null: false
    t.index ["name"], name: "ShipmentStatus_name_key", unique: true
  end

  create_table "ShipmentStatusHistory", id: :text, force: :cascade do |t|
    t.datetime "changedAt", precision: 3, default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.text "changedById"
    t.text "notes"
    t.text "shipmentId", null: false
    t.text "statusId", null: false
    t.index ["shipmentId"], name: "ShipmentStatusHistory_shipmentId_idx"
  end

  create_table "Template", id: :text, force: :cascade do |t|
    t.text "content", null: false
    t.datetime "createdAt", precision: 3, default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.boolean "isDefault", default: false, null: false
    t.text "name", null: false
    t.enum "type", null: false, enum_type: "\"TemplateType\""
    t.datetime "updatedAt", precision: 3, null: false
  end

  create_table "User", id: :text, force: :cascade do |t|
    t.datetime "createdAt", precision: 3, default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.text "email", null: false
    t.text "name", null: false
    t.text "password", null: false
    t.enum "role", default: "ADMIN", null: false, enum_type: "\"UserRole\""
    t.datetime "updatedAt", precision: 3, null: false
    t.index ["email"], name: "User_email_key", unique: true
  end

  create_table "active_storage_attachments", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.bigint "record_id", null: false
    t.string "record_type", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.string "content_type"
    t.datetime "created_at", null: false
    t.string "filename", null: false
    t.string "key", null: false
    t.text "metadata"
    t.string "service_name", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "car_showcases", id: :string, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "image", null: false
    t.boolean "is_active", default: true, null: false
    t.string "model", null: false
    t.integer "order", default: 0, null: false
    t.string "origin", null: false
    t.datetime "updated_at", null: false
    t.string "year", null: false
  end

  create_table "customers", id: :string, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "email"
    t.string "name", null: false
    t.string "phone"
    t.datetime "updated_at", null: false
  end

  create_table "leads", id: :string, force: :cascade do |t|
    t.boolean "contacted", default: false, null: false
    t.datetime "created_at", null: false
    t.string "document_status", null: false
    t.string "email", null: false
    t.string "name", null: false
    t.string "phone", null: false
    t.datetime "updated_at", null: false
  end

  create_table "shipment_status_histories", id: :string, force: :cascade do |t|
    t.datetime "changed_at", default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.string "changed_by_id"
    t.datetime "created_at", null: false
    t.text "notes"
    t.string "shipment_id", null: false
    t.string "status_id", null: false
    t.datetime "updated_at", null: false
    t.index ["shipment_id"], name: "index_shipment_status_histories_on_shipment_id"
  end

  create_table "shipment_statuses", id: :string, force: :cascade do |t|
    t.string "color"
    t.datetime "created_at", null: false
    t.string "description"
    t.boolean "is_transit", default: false, null: false
    t.string "name", null: false
    t.boolean "notify_email", default: false, null: false
    t.integer "order", default: 0, null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_shipment_statuses_on_name", unique: true
  end

  create_table "shipments", id: :string, force: :cascade do |t|
    t.string "color"
    t.datetime "created_at", null: false
    t.string "created_by_id"
    t.string "current_status_id"
    t.string "customer_id"
    t.string "manufacturer", null: false
    t.string "model", null: false
    t.text "notes"
    t.string "owner_email"
    t.string "owner_name", null: false
    t.string "owner_phone"
    t.string "pictures", default: [], array: true
    t.string "tracking_id", null: false
    t.datetime "updated_at", null: false
    t.string "vin", null: false
    t.integer "year"
    t.index ["tracking_id"], name: "index_shipments_on_tracking_id", unique: true
    t.index ["vin"], name: "index_shipments_on_vin", unique: true
  end

  create_table "templates", id: :string, force: :cascade do |t|
    t.text "content", null: false
    t.datetime "created_at", null: false
    t.boolean "is_default", default: false, null: false
    t.string "name", null: false
    t.integer "template_type", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", id: :string, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "jti", null: false
    t.string "name", null: false
    t.integer "role", default: 0, null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["jti"], name: "index_users_on_jti", unique: true
  end

  add_foreign_key "Shipment", "Customer", column: "customerId", name: "Shipment_customerId_fkey", on_update: :cascade, on_delete: :nullify
  add_foreign_key "Shipment", "ShipmentStatus", column: "currentStatusId", name: "Shipment_currentStatusId_fkey", on_update: :cascade, on_delete: :nullify
  add_foreign_key "Shipment", "User", column: "createdById", name: "Shipment_createdById_fkey", on_update: :cascade, on_delete: :nullify
  add_foreign_key "ShipmentStatusHistory", "Shipment", column: "shipmentId", name: "ShipmentStatusHistory_shipmentId_fkey", on_update: :cascade, on_delete: :cascade
  add_foreign_key "ShipmentStatusHistory", "ShipmentStatus", column: "statusId", name: "ShipmentStatusHistory_statusId_fkey", on_update: :cascade, on_delete: :restrict
  add_foreign_key "ShipmentStatusHistory", "User", column: "changedById", name: "ShipmentStatusHistory_changedById_fkey", on_update: :cascade, on_delete: :nullify
  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "shipment_status_histories", "shipment_statuses", column: "status_id"
  add_foreign_key "shipment_status_histories", "shipments"
  add_foreign_key "shipment_status_histories", "users", column: "changed_by_id"
  add_foreign_key "shipments", "customers"
  add_foreign_key "shipments", "shipment_statuses", column: "current_status_id"
  add_foreign_key "shipments", "users", column: "created_by_id"
end
