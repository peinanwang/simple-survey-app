class SurveyRequest < ApplicationRecord
  belongs_to :creator, class_name: "User"
  belongs_to :assigned_to, class_name: "User", optional: true

  def self.ransackable_attributes(auth_object = nil)
    %w[title creator_id]
  end

  STATUS = %w[new, assigned, completed].freeze

  validates :title, :description, :status, :questions, presence: true
end
