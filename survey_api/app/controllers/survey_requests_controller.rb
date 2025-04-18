class SurveyRequestsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_survey_request, only: [:show, :update, :destroy, :assign_user, :answer]

  def index
    # return all survey requests for admin and manager roles
    # return only assigned survey requests for regular user roles
    if current_user.admin_role? || current_user.manager_role?
      @survey_requests = SurveyRequest.all
    else
      @survey_requests = SurveyRequest.where(assigned_to_id: current_user.id)
    end
    render json: @survey_requests
  end

  def show
    render json: @survey_request
  end

  def create
    @survey_request = SurveyRequest.new(survey_request_params)
    @survey_request.creator = current_user
    @survey_request.status = "new"
    authorize @survey_request

    if @survey_request.save
      render json: @survey_request, status: :created
    else
      render json: @survey_request.errors, status: :unprocessable_entity
    end
  end

  def update
    authorize @survey_request

    if @survey_request.update(survey_request_params)
      render json: @survey_request
    else
      render json: @survey_request.errors, status: :unprocessable_entity
    end
  end

  def destroy
    authorize @survey_request
    @survey_request.destroy
    head :no_content
  end

  def assign_user
    authorize @survey_request
    user = User.find_by(id: params[:user_id])

    if user
      @survey_request.assigned_to = user
      @survey_request.status = "assigned"
      if @survey_request.save
        render json: @survey_request
      else
        render json: @survey_request.errors, status: :unprocessable_entity
      end
    else
      render json: { error: "User not found" }, status: :not_found
    end
  end

  def answer
    authorize @survey_request, :answer?

    answers = params.require(:answers).permit!

    # Validate that all question labels have a matching answer
    expected_labels = @survey_request.questions.map { |q| q["label"].to_s.strip }
    provided_labels = answers.keys.map(&:to_s).map(&:strip)

    answer_matched = expected_labels.sort == provided_labels.sort

    if !answer_matched
      return render json: { error: "Answers and the survey questions do not match" }, status: :unprocessable_entity
    end

    @survey_request.answers = answers
    @survey_request.status = "completed"

    if @survey_request.save
      render json: @survey_request
    else
      render json: @survey_request.errors, status: :unprocessable_entity
    end
  end

  def search
    permitted_keys = if current_user.admin_role? || current_user.manager_role?
      [ :title_cont, :creator_id_eq ]
    else
      [ :title_cont ]
    end

    permitted_params = params[:q]&.slice(*permitted_keys) || {}

    base_scope = current_user.admin_role? || current_user.manager_role? ? SurveyRequest.all : SurveyRequest.where(assigned_to_id: current_user.id)
    @q = base_scope.ransack(permitted_params)

    render json: @q.result
  end

  private

  def set_survey_request
    @survey_request = SurveyRequest.find(params[:id])
  end

  def survey_request_params
    params.require(:survey_request).permit(:title, :description, :status, questions: [:label, :data_type, :info])
  end
end
