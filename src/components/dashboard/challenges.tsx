"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Trophy, Star } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { useToast } from "@/hooks/use-toast";
import type { Challenge } from "@/lib/types";

function ChallengeList({
  challenges,
  onComplete,
}: {
  challenges: Challenge[];
  onComplete: (id: string) => void;
}) {
  const { toast } = useToast();

  const handleCheck = (challenge: Challenge) => {
    if (!challenge.completed) {
      onComplete(challenge.id);
      toast({
        title: "Challenge Completed!",
        description: `You earned ${challenge.reward_xp} XP!`,
      });
    }
  };

  if (!challenges || challenges.length === 0) {
    return (
      <div className="flex items-center justify-center p-4 text-center text-sm text-muted-foreground">
        <p>No challenges available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {challenges.map((challenge) => (
        <div
          key={challenge.id}
          className="flex items-center space-x-4 rounded-md border border-transparent p-2 transition-colors hover:bg-muted/50"
        >
          <Checkbox
            id={challenge.id}
            checked={challenge.completed}
            onCheckedChange={() => handleCheck(challenge)}
            className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
          />
          <div className="flex-1">
            <label
              htmlFor={challenge.id}
              className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {challenge.title}
            </label>
            <p className="text-xs text-muted-foreground">
              {challenge.description}
            </p>
          </div>
          <div className="flex items-center text-xs text-accent">
            <Star className="mr-1 h-3 w-3" />
            <span>{challenge.reward_xp} XP</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ChallengesPanel() {
  const { dailyChallenges, weeklyChallenges, completeChallenge } =
    useAppContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
          <Trophy className="h-6 w-6 text-primary" />
          Missions
        </CardTitle>
        <CardDescription>
          Complete challenges to level up your companion.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="daily">
          <TabsList className="grid w-full grid-cols-2 bg-muted/50">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
          </TabsList>
          <TabsContent value="daily" className="mt-4">
            <ChallengeList
              challenges={dailyChallenges}
              onComplete={completeChallenge}
            />
          </TabsContent>
          <TabsContent value="weekly" className="mt-4">
            <ChallengeList
              challenges={weeklyChallenges}
              onComplete={completeChallenge}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
