SurveyRequest.delete_all
User.delete_all

# Create Users
user1 = User.create!(email: "test_1@email.com", password: "123456", name: "User One", role: :user)
user2 = User.create!(email: "test_2@email.com", password: "123456", name: "User Two", role: :user)
admin = User.create!(email: "admin@example.com", password: "123456", name: "Admin User", role: :admin)
manager = User.create!(email: "manager@example.com", password: "123456", name: "Manager User", role: :manager)

# Define common questions
question_set_1 = [
  { label: "What is your favorite color?", data_type: "string", info: "Pick any color you like." },
  { label: "Why do you like this color?", data_type: "string", info: "Briefly explain." }
]

question_set_2 = [
  { label: "How often do you exercise?", data_type: "string", info: "Daily, Weekly, etc." },
  { label: "What type of exercise do you prefer?", data_type: "string", info: "Running, Gym, Yoga, etc." }
]

# Create surveys assigned to user1 (2 incomplete, 1 completed)
2.times do
  SurveyRequest.create!(
    title: "Survey for User One",
    description: "General feedback survey",
    status: "assigned",
    questions: question_set_1,
    creator: admin,
    assigned_to: user1
  )
end

SurveyRequest.create!(
  title: "Completed Survey for User One",
  description: "Completed feedback",
  status: "completed",
  questions: question_set_1,
  answers: {
    "What is your favorite color?" => "Blue",
    "Why do you like this color?" => "It's calming."
  },
  creator: admin,
  assigned_to: user1
)

# Create surveys assigned to user2 (2 incomplete, 1 completed)
2.times do
  SurveyRequest.create!(
    title: "Survey for User Two",
    description: "Health habits",
    status: "assigned",
    questions: question_set_2,
    creator: manager,
    assigned_to: user2
  )
end

SurveyRequest.create!(
  title: "Completed Survey for User Two",
  description: "Exercise routine feedback",
  status: "completed",
  questions: question_set_2,
  answers: {
    "How often do you exercise?" => "3 times a week",
    "What type of exercise do you prefer?" => "Yoga"
  },
  creator: manager,
  assigned_to: user2
)

# Unassigned surveys
SurveyRequest.create!(
  title: "Unassigned Survey (Admin)",
  description: "Created by admin, not yet assigned",
  status: "new",
  questions: question_set_1,
  creator: admin
)

SurveyRequest.create!(
  title: "Unassigned Survey (Manager)",
  description: "Created by manager, not yet assigned",
  status: "new",
  questions: question_set_2,
  creator: manager
)
