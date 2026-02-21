Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      post "auth/login", to: "sessions#create"
      delete "auth/logout", to: "sessions#destroy"
      get "auth/me", to: "me#show"

      resources :shipments do
        member do
          patch :update_status
        end
      end

      resources :leads, only: [ :index, :create, :destroy ] do
        member do
          patch :mark_contacted
          patch :mark_uncontacted
        end
        collection do
          delete :bulk_destroy
        end
      end

      resources :statuses, only: [ :index, :create, :update, :destroy ] do
        collection do
          patch :reorder
        end
      end

      resources :templates, only: [ :index, :show, :create, :update, :destroy ] do
        collection do
          post :preview
        end
      end

      resources :showcases, only: [ :index, :create, :update, :destroy ] do
        member do
          patch :toggle_active
        end
        collection do
          patch :reorder
        end
      end

      resources :users, only: [ :index, :create, :update, :destroy ]

      resources :emails, only: [] do
        collection do
          post :status_update
          post :thank_you
          post :custom
        end
      end

      resources :documents, only: [] do
        collection do
          post :generate
          post :send_email
        end
      end

      post "uploads", to: "uploads#create"

      get "dashboard", to: "dashboard#index"

      # Public endpoints (no auth)
      get "public/showcases", to: "showcases#public_index"
      get "track/:tracking_id", to: "tracking#show"
    end
  end

  get "up" => "rails/health#show", as: :rails_health_check
end
