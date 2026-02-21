if ENV["RESEND_API_KEY"].present?
  ActionMailer::Base.smtp_settings = {
    address: "smtp.resend.com",
    port: 587,
    authentication: :plain,
    user_name: "resend",
    password: ENV["RESEND_API_KEY"],
    enable_starttls_auto: true
  }
  ActionMailer::Base.delivery_method = :smtp
else
  ActionMailer::Base.delivery_method = :test
end
