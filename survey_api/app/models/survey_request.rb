class SurveyRequest < ApplicationRecord
  belongs_to :creator, class_name: "User"
  belongs_to :assigned_to, class_name: "User", optional: true

  STATUS = %w[user manager admin].freeze

  validates :title, :description, :status, :questions, presence: true
end
