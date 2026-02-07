"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Beaker, ImageUp, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase-client"; // Import client-side supabase

type DbStatus = "checking" | "connected" | "disconnected";
type UploadingState = {
    logo?: boolean;
    symbol?: boolean;
}

export default function TestPage() {
  const [dbStatus, setDbStatus] = useState<DbStatus>("checking");
  const [dbError, setDbError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<UploadingState>({});
  const { toast } = useToast();


  useEffect(() => {
    const checkDbStatus = async () => {
      setDbStatus("checking");
      setDbError(null);
      try {
        const response = await fetch('/api/db-status');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch database status.');
        }

        setDbStatus(data.status);

      } catch (error) {
        setDbStatus("disconnected");
        let errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        
        if (errorMessage.includes('getaddrinfo ENOTFOUND')) {
            errorMessage = `DNS lookup failed for the database host. This is a network issue, not a password error. It means the server running the app could not find the database address specified in your .env file.

**Please double-check the following:**
1. **Is there a typo in the hostname** part of the DATABASE_URL in your .env file?
2. **Is your Supabase project paused?** It must be 'Active' to accept connections.`;
        } else if (errorMessage.includes('password authentication failed')) {
            errorMessage = 'Authentication failed. Please double-check the username and password in your DATABASE_URL in the .env file.';
        }
        
        setDbError(errorMessage);
      }
    };

    checkDbStatus();
  }, []);

  const getStatusText = () => {
    switch (dbStatus) {
      case "checking":
        return "Checking...";
      case "connected":
        return "Connected";
      case "disconnected":
        return "Disconnected";
    }
  };
  
  const handleAssetUpload = async (
    e: React.FormEvent<HTMLFormElement>,
    assetType: 'logo' | 'symbol'
  ) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fileInput = form.elements.namedItem(assetType === 'logo' ? 'logo-upload' : 'symbol-upload') as HTMLInputElement;
    const file = fileInput.files?.[0];

    if (!file) {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please choose a file to upload.",
      });
      return;
    }

    setUploading(prev => ({ ...prev, [assetType]: true }));

    try {
        const assetName = assetType === 'logo' ? 'app_logo' : 'currency_symbol_sar';
        const fileExt = file.name.split('.').pop();
        const filePath = `${assetName}-${Date.now()}.${fileExt}`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
            .from('app_assets')
            .upload(filePath, file);

        if (uploadError) {
            throw uploadError;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('app_assets')
            .getPublicUrl(filePath);

        if (!publicUrl) {
            throw new Error("Could not get public URL for the uploaded file.");
        }

        // Save URL to database via our API route
        const response = await fetch('/api/assets/save-url', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ asset_name: assetName, asset_url: publicUrl }),
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || 'Failed to save asset URL to the database.');
        }

        toast({
            title: "Upload Successful",
            description: `The ${assetType} has been uploaded and saved.`,
        });

    } catch (error: any) {
        let title = "Upload Failed";
        let description = error.message;

        if (error.message.includes("Bucket not found")) {
            title = "Storage Bucket Missing";
            description = "Please create a public Supabase Storage bucket named 'app_assets' first.";
        } else if (error.message.includes("violates row-level security policy")) {
            title = "Database Security Policy Error";
            description = "The database is blocking the request due to a Row-Level Security policy. Please go to your Supabase Dashboard, navigate to Authentication -> Policies, and ensure there is a policy on the 'app_assets' table that allows INSERT operations. Or, you can disable RLS for this table.";
        }

        toast({
            variant: "destructive",
            title: title,
            description: description,
        });
    } finally {
        setUploading(prev => ({ ...prev, [assetType]: false }));
    }
  };


  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex-grow">
              <CardTitle className="flex items-center gap-2 text-xl font-bold">
                <Beaker className="h-5 w-5 text-primary" />
                Test Page
              </CardTitle>
              <CardDescription className="pt-2">
                This page checks the connection status to your PostgreSQL database.
              </CardDescription>
            </div>
            
            <div className="flex flex-shrink-0 items-center gap-2 rounded-lg bg-muted p-2 px-3">
              <div
                className={cn(
                  "h-3 w-3 rounded-full",
                  dbStatus === "checking" && "animate-pulse bg-chart-3",
                  dbStatus === "connected" && "bg-chart-1",
                  dbStatus === "disconnected" && "bg-destructive"
                )}
              />
              <span className="text-sm font-medium text-muted-foreground">
                {getStatusText()}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p>
            The status indicator above reflects the result from the <code>/api/db-status</code> endpoint.
          </p>
          {dbError && (
            <div className="mt-4 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                <p className="font-semibold">Connection Error:</p>
                <p className="whitespace-pre-wrap">{dbError}</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
            <ImageUp className="h-5 w-5 text-primary" />
            Branding
            </CardTitle>
            <CardDescription>
            Upload and manage application assets like the logo. You must first create a public Supabase Storage bucket named "app_assets".
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
            <form onSubmit={(e) => handleAssetUpload(e, 'logo')} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="logo-upload">Upload App Logo</Label>
                    <Input id="logo-upload" name="logo-upload" type="file" accept="image/png, image/jpeg, image/svg+xml" disabled={uploading.logo} />
                </div>
                <Button type="submit" disabled={uploading.logo}>
                    {uploading.logo ? <Loader2 className="animate-spin" /> : "Upload Logo"}
                </Button>
            </form>
            <div className="border-t pt-8">
                <form onSubmit={(e) => handleAssetUpload(e, 'symbol')} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="symbol-upload">Upload Riyal Symbol</Label>
                        <Input id="symbol-upload" name="symbol-upload" type="file" accept="image/png, image/svg+xml" disabled={uploading.symbol} />
                    </div>
                    <Button type="submit" disabled={uploading.symbol}>
                         {uploading.symbol ? <Loader2 className="animate-spin" /> : "Upload Symbol"}
                    </Button>
                </form>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
