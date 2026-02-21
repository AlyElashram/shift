module Api
  module V1
    class UploadsController < BaseController
      def create
        if params[:file].blank?
          return render_error("No file provided")
        end

        blob = ActiveStorage::Blob.create_and_upload!(
          io: params[:file],
          filename: params[:file].original_filename,
          content_type: params[:file].content_type
        )

        url = Rails.application.routes.url_helpers.rails_blob_url(blob, host: request.base_url)

        render json: { url: url }, status: :created
      end
    end
  end
end
