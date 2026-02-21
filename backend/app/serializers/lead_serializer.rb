class LeadSerializer
  include Alba::Resource

  attributes :id, :name, :email, :phone, :document_status, :contacted, :created_at, :updated_at
end
