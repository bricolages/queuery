class CreateClientCredentials < ActiveRecord::Migration[5.0]
  def change
    create_table :client_credentials do |t|
      t.integer :client_account_id, null: false
      t.string :token, null: false, limit: 43 # Base64 encoded 32byte = 32 * (4 / 3) chars
      t.string :token_secret_digest, null: false, limit: 60
      t.boolean :disabled, default: false, null: false
      t.timestamps
    end

    add_index :client_credentials, :client_account_id
    add_index :client_credentials, :token, unique: true
  end
end
