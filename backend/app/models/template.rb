class Template < ApplicationRecord
  include HasStringId

  enum :template_type, { contract: 0, bill: 1, email: 2 }

  validates :name, presence: true
  validates :content, presence: true
  validates :template_type, presence: true
end
