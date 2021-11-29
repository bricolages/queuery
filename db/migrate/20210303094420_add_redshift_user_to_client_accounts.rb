class AddRedshiftUserToClientAccounts < ActiveRecord::Migration[5.0]
  def change
    add_column :client_accounts, :redshift_user, :string, null: false, default: 'queuery'
  end
end
