import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Key } from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";

export default function UsersList() {
  const queryClient = useQueryClient();
  
  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*");
      
      if (error) throw error;
      return data;
    },
  });

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        () => {
          // Invalidate and refetch users query
          queryClient.invalidateQueries({ queryKey: ["users"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const handleCopy = (text: string, type: "email" | "password") => {
    navigator.clipboard.writeText(text);
    toast.success(`${type === "email" ? "Email" : "Password"} copied to clipboard`);
  };

  const handleResetPassword = async (userId: string) => {
    try {
      const response = await supabase.functions.invoke('reset-user-password', {
        body: { userId },
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to reset password');
      }

      // Copy the new password to clipboard
      if (response.data?.password) {
        navigator.clipboard.writeText(response.data.password);
        toast.success("New password copied to clipboard");
      }
    } catch (error: any) {
      console.error("Error resetting password:", error);
      toast.error(error.message || "Failed to reset password");
    }
  };

  if (isLoading) {
    return <div>Loading users...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
        <CardDescription>List of all users in the system</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users?.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex-grow space-y-2">
                <h3 className="font-medium text-lg">{user.full_name || "Unnamed User"}</h3>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">Email:</span>
                    <span className="text-sm">{user.email}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 hover:bg-secondary"
                      onClick={() => handleCopy(user.email || "", "email")}
                      title="Copy email"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  {(user as any).password && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground">Password:</span>
                      <span className="text-sm font-mono">{(user as any).password}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 hover:bg-secondary"
                        onClick={() => handleCopy((user as any).password, "password")}
                        title="Copy current password"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 hover:bg-secondary"
                        onClick={() => handleResetPassword(user.id)}
                        title="Change password and copy new one"
                      >
                        <Key className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">Type:</span>
                    <Badge variant="secondary">{user.role}</Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}