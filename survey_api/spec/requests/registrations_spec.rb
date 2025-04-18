require 'rails_helper'

RSpec.describe "User Sign Up", type: :request do
  describe "POST /signup" do
    let(:valid_params) do
      {
        user: {
          email: "test@example.com",
          name: "John Doe",
          password: "password123"
        }
      }
    end

    it "creates a new user and returns json with JWT token and user info" do
      post "/signup", params: valid_params

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)

      expect(json.dig("status", "code")).to eq(200)
      expect(json.dig("status", "token")).to be_present
      expect(json.dig("status", "data", "email")).to eq("test@example.com")
    end

    %w[name email password].each do |field|
      it "returns error if #{field} is missing" do
        invalid_params = { user: valid_params[:user].except(field.to_sym) }

        post "/signup", params: invalid_params

        expect(response).to have_http_status(:unprocessable_entity)
        json = JSON.parse(response.body)

        expect(json.dig("status", "message")).to include("#{field.capitalize} can't be blank")
      end
    end

    it "returns error if email is already taken" do

      create(:user, email: "taken@example.com")
      post "/signup", params: {
        user: {
          email: "taken@example.com",
          name: "Another User",
          password: "password123"
        }
      }

      expect(response).to have_http_status(:unprocessable_entity)
      json = JSON.parse(response.body)

      expect(json.dig("status", "message")).to include("Email has already been taken")
    end
  end
end
