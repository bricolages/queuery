class CreateQuery < ActiveRecord::Migration[5.0]
  def change
    create_table :queries do |t|
      t.text :select_stmt, null: false
      t.integer :client_account_id, null: false
      t.uuid :job_id, null: false
      t.timestamp :created_at, null: false
    end
  end
end
