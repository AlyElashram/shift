module HasStringId
  extend ActiveSupport::Concern

  included do
    before_create :generate_string_id
  end

  private

  def generate_string_id
    self.id ||= SecureRandom.alphanumeric(25)
  end
end
