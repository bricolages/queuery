# Allow localhost to use secure cookies.

if Rails.env.development?
  module SecureCookieInLocalhostPatch
    def security_matches?(request, options)
      super || request.host == 'localhost'
    end
  end

  ActionDispatch::Session::CookieStore.prepend(SecureCookieInLocalhostPatch)
end
