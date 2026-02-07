"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ReceiptText, Users, QrCode, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const options = [
    { label: "Request Payment", icon: ReceiptText },
    { label: "Split Bill", icon: Users },
    { label: "Scan to Pay", icon: QrCode },
]

export default function MoreOptionsPanel() {
    const { toast } = useToast();
    
    const handleOptionClick = (label: string) => {
        toast({
            title: `${label} Clicked`,
            description: "This feature is for demonstration purposes.",
        });
    };
    
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
          <MoreHorizontal className="h-5 w-5 text-primary" />
          More Options
        </CardTitle>
        <CardDescription>
          Explore other financial tools and features.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2">
            {options.map(option => (
                 <Button key={option.label} variant="ghost" className="h-14 justify-between" onClick={() => handleOptionClick(option.label)}>
                     <div className="flex items-center gap-4">
                        <option.icon className="h-6 w-6 text-muted-foreground"/>
                        <span className="font-semibold">{option.label}</span>
                     </div>
                     <ChevronRight className="h-5 w-5 text-muted-foreground" />
                 </Button>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
