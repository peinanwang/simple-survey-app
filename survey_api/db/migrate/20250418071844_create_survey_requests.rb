class CreateSurveyRequests < ActiveRecord::Migration[7.2]
  def change
    create_table :survey_requests do |t|
      t.string :title, null: false
      t.text :description, null: false
      t.string :status, null: false, default: "new"

      t.json :questions, null: false, default: []
      t.json :answers, null: true

      t.references :creator, null: false, foreign_key: { to_table: :users }
      t.references :assigned_to, foreign_key: { to_table: :users }

      t.timestamps
    end
  end
end
