class Rack::Attack
  throttle("login/ip", limit: 5, period: 15.minutes) do |req|
    req.ip if req.path == "/api/v1/auth/login" && req.post?
  end

  self.throttled_responder = lambda do |_env|
    [
      429,
      { "Content-Type" => "application/json", "Retry-After" => "900" },
      [ { error: "Too many login attempts. Try again in 15 minutes." }.to_json ]
    ]
  end
end
