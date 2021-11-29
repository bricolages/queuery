class QueryError < ApplicationRecord
  # FIXME: associated by job_id...
  belongs_to :query, foreign_key: :job_id, primary_key: :job_id
end
