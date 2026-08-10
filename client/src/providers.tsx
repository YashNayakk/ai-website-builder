import { AuthProvider } from './components/auth/auth-provider';
import { authClient } from "@/lib/auth-client";
import { useNavigate, NavLink } from "react-router-dom";

export function Providers({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  return (
    <AuthProvider
    authClient={authClient}
    navigate={({ to }: { to: string }) => navigate(to)}
    Link={(props: any) => <NavLink {...props} to={props.href}/>}
    >
      {children}
    </AuthProvider>
  );
}