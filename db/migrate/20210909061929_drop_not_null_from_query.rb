class DropNotNullFromQuery < ActiveRecord::Migration[5.0]
  def change
    change_column :queries, :job_id, :uuid, null: true
  end
end
