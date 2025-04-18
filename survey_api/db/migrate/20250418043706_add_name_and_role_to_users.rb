class AddNameAndRoleToUsers < ActiveRecord::Migration[7.2]
  def change
    add_column :users, :name, :string, null: false
    add_column :users, :role, :string, default: 'user'
  end
end
