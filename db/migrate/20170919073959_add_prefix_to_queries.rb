class AddPrefixToQueries < ActiveRecord::Migration[5.0]
  def change
    add_column :queries, :timestamp_prefix, :text, null: false, default: ''
  end
end
