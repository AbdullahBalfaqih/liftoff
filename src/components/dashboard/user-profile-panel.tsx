"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User, Mail, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppContext } from "@/context/AppContext";

function calculateAge(dateOfBirth: string | null | undefined): number | null {
  if (!dateOfBirth) return null;
  try {
    const birthDate = new Date(dateOfBirth);
    if (isNaN(birthDate.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  } catch (e) {
    return null;
  }
}

export default function UserProfilePanel() {
  const { user, loading } = useAppContext();

  const age = useMemo(() => calculateAge(user?.date_of_birth), [user?.date_of_birth]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
            <User className="h-5 w-5 text-primary"/>
            User Profile
        </CardTitle>
        <CardDescription>View and manage your personal information.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
            </div>
          </div>
        ) : user ? (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">{user.full_name}</h2>
              <p className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4"/>
                  {user.email}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
              <div className="flex items-center gap-2 rounded-lg bg-muted p-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <strong>Age:</strong>
                <span>{age !== null && age >= 0 ? `${age} years old` : "Not specified"}</span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-muted-foreground">Could not load user data. Please try logging in again.</p>
        )}
      </CardContent>
    </Card>
  );
}
