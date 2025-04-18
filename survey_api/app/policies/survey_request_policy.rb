class SurveyRequestPolicy < ApplicationPolicy
  # NOTE: Up to Pundit v2.3.1, the inheritance was declared as
  # `Scope < Scope` rather than `Scope < ApplicationPolicy::Scope`.
  # In most cases the behavior will be identical, but if updating existing
  # code, beware of possible changes to the ancestors:
  # https://gist.github.com/Burgestrand/4b4bc22f31c8a95c425fc0e30d7ef1f5

  def create?
    # Both admin and manager roles can create survey requests
    puts "validating create? for #{user.role}"
    user.admin_role? || user.manager_role?
  end

  def update?
    # Admin: full update access
    # Manager: can only update their own survey requests
    user.admin_role? || (user.manager_role? && record.creator_id == user.id)
  end

  def destroy?
    # Admin: full delete access
    user.admin_role?
  end

  def assign_user?
    # Admin: can assign any survey request to any user
    # Manager: can assign survey requests that are created by Admin.

    if user.admin_role?
      return true
    elsif user.manager_role?
      creator = User.find(record.creator_id)
      return creator.admin_role?
    else
      return false
    end
  end

  def answer?
    # Only the assigned users can submit their answers
    record.assigned_to_id == user.id && record.status == "assigned"
  end

  class Scope < ApplicationPolicy::Scope
    def resolve
      if user.admin_role? || user.manager_role?
        scope.all
      else
        scope.where(assigned_to_id: user.id)
      end
    end
  end
end
