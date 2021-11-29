class AddDataApiColumnsToQueries < ActiveRecord::Migration[6.1]
  def change
    add_column :queries, :data_api_id, :uuid, null: true
    add_column :queries, :data_api_status, :text, null: true
  end
end
