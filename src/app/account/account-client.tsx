"use client";

import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut, updatePassword } from "../../../src/app/auth/actions";
import { createClient } from "../../../utils/supabase/client";

interface AccountClientProps {
  user: User;
}

export default function AccountClient({ user }: AccountClientProps) {
  const [name, setName] = useState(user.user_metadata?.name || "");
  const [saved, setSaved] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [orgName, setOrgName] = useState("Acme Corporation");
  const [simulationsCount, setSimulationsCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimulationStats = async () => {
      try {
        const supabase = createClient();
        // Get the organization name from user metadata
        if (user.user_metadata?.organization) {
          setOrgName(user.user_metadata.organization);
        }

        // Count the simulations created by the user
        const { count, error } = await supabase
          .from("simulations")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id);

        if (!error && count !== null) {
          setSimulationsCount(count);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSimulationStats();
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        data: { name },
      });

      if (error) throw error;

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess(false);

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords don't match");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }

    try {
      setIsUpdatingPassword(true);
      const result = await updatePassword(currentPassword, newPassword);

      if (result.success) {
        setPasswordSuccess(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordError(result.error || "Failed to update password");
      }
    } catch (error) {
      console.error("Error:", error);
      setPasswordError("An unexpected error occurred");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // Get user initials for avatar fallback
  const getInitials = () => {
    if (name) {
      return name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase();
    }
    return user.email?.substring(0, 2).toUpperCase() || "U";
  };

  return (
    <AppSidebar
      activePage="account"
      pageTitle="Account"
      userName={name || "User"}
      userEmail={user.email || ""}
      userInitials={getInitials()}
    >
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Account Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your profile and security settings
          </p>
        </div>
        <div className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-100 flex items-center">
          <span className="text-sm font-medium mr-2">{orgName}</span>
          <span className="text-xs text-muted-foreground bg-white px-2 py-0.5 rounded border">
            Enterprise
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your account details and personal information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email || ""}
                    disabled
                  />
                  <p className="text-sm text-gray-500">
                    Your email address is used for login and cannot be changed
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>

                <Button type="submit">Save Changes</Button>

                {saved && (
                  <div className="bg-green-50 p-3 rounded-md text-green-800 mt-4">
                    Profile updated successfully!
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>
                Manage your password and account security
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Password must be at least 8 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                {passwordError && (
                  <div className="p-3 rounded-md bg-red-50 text-red-800 text-sm">
                    {passwordError}
                  </div>
                )}

                {passwordSuccess && (
                  <div className="p-3 rounded-md bg-green-50 text-green-800 text-sm">
                    Password updated successfully
                  </div>
                )}

                <Button type="submit" disabled={isUpdatingPassword}>
                  {isUpdatingPassword ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>
                Your personal identity and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-slate-50 shadow-sm">
                  <AvatarImage
                    src="/images/avatar.jpeg"
                    alt={name || user.email || "User"}
                  />
                  <AvatarFallback className="text-lg bg-slate-100">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-lg">{name || "User"}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <p className="text-xs mt-1 px-2 py-0.5 bg-slate-100 rounded-full inline-block">
                    {orgName} • Enterprise
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Enterprise Account</CardTitle>
              <CardDescription>
                Your organization's subscription information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Plan</span>
                  <span className="text-sm font-medium">Enterprise</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-800 rounded-full w-full"></div>
                </div>
              </div>

              <Separator />

              {!loading && simulationsCount !== null && (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{simulationsCount}</p>
                    <p className="text-xs text-muted-foreground">
                      Simulations Run
                    </p>
                  </div>
                  <div className="h-8 w-px bg-slate-100 mx-2"></div>
                  <div>
                    <p className="text-sm font-medium">Unlimited</p>
                    <p className="text-xs text-muted-foreground">Capacity</p>
                  </div>
                  <div className="h-8 w-px bg-slate-100 mx-2"></div>
                  <div>
                    <p className="text-sm font-medium">
                      {new Date().getFullYear() + 1}
                    </p>
                    <p className="text-xs text-muted-foreground">Valid Until</p>
                  </div>
                </div>
              )}

              {loading && (
                <div className="py-2 flex justify-center">
                  <div className="animate-pulse flex space-x-4">
                    <div className="h-5 w-24 bg-slate-100 rounded"></div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <div className="text-xs text-muted-foreground w-full">
                Account created on{" "}
                {new Date(user.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <form action={signOut} className="w-full">
                <Button type="submit" variant="outline" className="w-full">
                  Sign Out
                </Button>
              </form>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AppSidebar>
  );
}
