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

  def admin?
    role == 'admin'
  end

  def manager?
    role == 'manager'
  end
end
