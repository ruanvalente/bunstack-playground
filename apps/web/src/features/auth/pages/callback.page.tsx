import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { supabase } from '@shared/config/supabase';
import { useAuthStore } from '../store/auth.store';

export function CallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser, setSession } = useAuthStore();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = searchParams.get('access_token') || hashParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token') || hashParams.get('refresh_token');

        if (accessToken) {
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
          });

          if (error) {
            console.error('Set session error:', error);
            navigate('/auth');
            return;
          }

          if (data.session) {
            setSession({
              access_token: data.session.access_token,
              refresh_token: data.session.refresh_token || undefined,
              expires_at: data.session.expires_at ?? Date.now() + 3600000,
            });
            setUser(data.session.user);
            navigate('/dashboard');
            return;
          }
        }

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Session error:', sessionError);
          navigate('/auth');
          return;
        }

        if (session) {
          setSession({
            access_token: session.access_token,
            refresh_token: session.refresh_token || undefined,
            expires_at: session.expires_at ?? Date.now() + 3600000,
          });
          setUser(session.user);
          navigate('/dashboard');
          return;
        }

        navigate('/auth');
      } catch (err) {
        console.error('Callback error:', err);
        navigate('/auth');
      }
    };

    handleCallback();
  }, [navigate, searchParams, setUser, setSession]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Processing authentication...</p>
      </div>
    </div>
  );
}
