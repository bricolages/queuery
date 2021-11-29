class CreateClientAccount < ActiveRecord::Migration[5.0]
  def change
    create_table :client_accounts do |t|
      t.string :name, null: false
      t.timestamp :created_at, null: false
    end

    add_index :client_accounts, :name, unique: true
  end
end
