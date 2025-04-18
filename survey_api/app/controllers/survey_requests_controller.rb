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

    if @survey_request.assigned_to_id != current_user.id
      return render json: { error: "Unauthorized to answer this survey" }, status: :forbidden
    end

    # ASSUMPTION: trust the users to send full set of the answers.
    # i.e., the response is sent from the frontend UI, not from any other source.
    answers = params.require(:answers).permit!
    @survey_request.answers = answers
    @survey_request.status = "completed"

    if @survey_request.save
      render json: @survey_request
    else
      render json: @survey_request.errors, status: :unprocessable_entity
    end
  end

  private

  def set_survey_request
    @survey_request = SurveyRequest.find(params[:id])
  end

  def survey_request_params
    params.require(:survey_request).permit(:title, :description, :status, questions: [:label, :data_type, :info])
  end
end
