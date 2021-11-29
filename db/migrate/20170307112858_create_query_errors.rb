class CreateQueryErrors < ActiveRecord::Migration[5.0]
  def change
    create_table :query_errors do |t|
      t.uuid :job_id, null: false
      t.text :message
      t.timestamp :created_at, null: false
    end
  end
end
