class TemplateSerializer
  include Alba::Resource

  attributes :id, :name, :template_type, :content, :is_default, :created_at, :updated_at
end
