Rails.application.config.middleware.insert_before 0, Rack::Cors do
    allow do
      origins 'http://localhost:3000'  # La URL de tu frontend
      resource '*', headers: :any, methods: [:get, :post, :put, :patch, :delete, :options]
    end
  end