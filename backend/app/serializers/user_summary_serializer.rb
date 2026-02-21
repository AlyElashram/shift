class UserSummarySerializer
  include Alba::Resource

  attributes :id, :name, :email, :role
end
