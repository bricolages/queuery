# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2021_10_18_110215) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "client_accounts", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.string "redshift_user", default: "queuery", null: false
    t.index ["name"], name: "index_client_accounts_on_name", unique: true
  end

  create_table "client_credentials", force: :cascade do |t|
    t.integer "client_account_id", null: false
    t.string "token", limit: 43, null: false
    t.string "token_secret_digest", limit: 60, null: false
    t.boolean "disabled", default: false, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["client_account_id"], name: "index_client_credentials_on_client_account_id"
    t.index ["token"], name: "index_client_credentials_on_token", unique: true
  end

  create_table "queries", force: :cascade do |t|
    t.text "select_stmt", null: false
    t.integer "client_account_id", null: false
    t.uuid "job_id"
    t.datetime "created_at", null: false
    t.text "timestamp_prefix", default: "", null: false
    t.uuid "data_api_id"
    t.text "data_api_status"
  end

  create_table "query_errors", force: :cascade do |t|
    t.uuid "job_id", null: false
    t.text "message"
    t.datetime "created_at", null: false
  end

end
