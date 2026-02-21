puts "Seeding database..."

# Create Super Admin
admin = User.find_or_initialize_by(email: "admin@shift.com")
admin.assign_attributes(
  name: "Super Admin",
  password: "admin123",
  role: :super_admin
)
admin.save!
puts "Created Super Admin: #{admin.email}"

# Create Default Shipment Statuses
statuses = [
  { name: "Ordered", order: 1, is_transit: false, notify_email: true, color: "#FFD628" },
  { name: "In Saudi / Deba", order: 2, is_transit: true, notify_email: false, color: "#3B82F6" },
  { name: "Markeb to Safaga", order: 3, is_transit: true, notify_email: false, color: "#3B82F6" },
  { name: "Arriving Soon", order: 4, is_transit: true, notify_email: true, color: "#F59E0B" },
  { name: "Delivered", order: 5, is_transit: false, notify_email: true, color: "#10B981" }
]

statuses.each do |attrs|
  status = ShipmentStatus.find_or_initialize_by(name: attrs[:name])
  status.assign_attributes(attrs)
  status.save!
end
puts "Created #{statuses.size} default statuses"

puts "Seeding complete!"
