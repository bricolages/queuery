require 'test_helper'

class QueryTest < Test::Unit::TestCase
  ClientAccount = Struct.new(:name)

  test "query parameter binding translates %% as %" do
    client_account = ClientAccount.new('test-client')
    assert_equal 'select * from t', Query.bind_sql_parameters('select * from t', [], client_account)
    assert_equal "select * from t where k = 1", Query.bind_sql_parameters("select * from t where k = ?", [1], client_account)
    assert_equal "select * from t where k = 'str'", Query.bind_sql_parameters("select * from t where k = ?", ['str'], client_account)
    assert_equal "select * from t where k like '%word%'", Query.bind_sql_parameters("select * from t where k like '%word%'", [], client_account)

    # FIXME: tmp
    assert_equal "select * from t where k like '%word%'", Query.bind_sql_parameters("select * from t where k like '%%word%%'", [], client_account)
  end

  test "query parameter binding does not replace '?' in comments or strings" do
    assert_equal "select * from t where id = 5", Query.replace_sql_parameters("select * from t where id = ?") { 5 }

    values = [1, 2, 3]
    assert_equal "select * from t where x = 1 and y = 2 and z = 3", Query.replace_sql_parameters("select * from t where x = ? and y = ? and z = ?") { values.shift }

    assert_equal "select * from t where id = 5 -- ok?", Query.replace_sql_parameters("select * from t where id = ? -- ok?") { 5 }
    assert_equal "select * from t where id = 5 /* ok? */", Query.replace_sql_parameters("select * from t where id = ? /* ok? */") { 5 }
    assert_equal "select * from t where id = 5 and word = '?'", Query.replace_sql_parameters("select * from t where id = ? and word = '?'") { 5 }
    assert_equal "select * from t /* ? */ where id = 5 and word = '?'", Query.replace_sql_parameters("select * from t /* ? */ where id = ? and word = '?'") { 5 }

    expected = <<-EndSQL
select *, '?'
from t -- t?
where id = /* ?
*/ 5
order by 1
EndSQL
    source = <<-EndSQL
select *, '?'
from t -- t?
where id = /* ?
*/ ?
order by 1
EndSQL
    assert_equal(expected, Query.replace_sql_parameters(source) { 5 })
  end
end
