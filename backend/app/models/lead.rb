class Lead < ApplicationRecord
  include HasStringId

  DOCUMENT_STATUSES = %w[non-egyptian-passport uae-eqama none].freeze

  validates :name, presence: true
  validates :email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :phone, presence: true
  validates :document_status, presence: true, inclusion: { in: DOCUMENT_STATUSES }
end
