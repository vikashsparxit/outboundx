import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/providers/AuthProvider";

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <nav className="border-b bg-background fixed top-0 left-0 right-0 z-50">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center justify-end w-full">
          {user && (
            <>
              <span className="text-sm text-muted-foreground">
                {user.email}
              </span>
              <Button onClick={handleSignOut} variant="outline" size="sm" className="ml-4">
                Sign Out
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;