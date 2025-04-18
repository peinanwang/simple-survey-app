class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: self

  ROLES = %w[user manager admin].freeze
  validates :name, presence: true
  validates :role, presence: true, inclusion: { in: ROLES }

  has_many :created_surveys, class_name: "SurveyRequest", foreign_key: :creator_id
  has_many :assigned_surveys, class_name: "SurveyRequest", foreign_key: :assigned_to_id

  def admin_role?
    role == 'admin'
  end

  def manager_role?
    role == 'manager'
  end
end
