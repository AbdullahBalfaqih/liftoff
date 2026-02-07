"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Gem, Sparkles, Zap, Smile, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { getEvolutionStageForLevel } from "@/lib/character-evolution";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useAppContext } from "@/context/AppContext";
import { Skeleton } from "@/components/ui/skeleton";

export default function CharacterPanel() {
  const { companion, loading } = useAppContext();

  if (loading || !companion) {
      return (
          <Card>
              <CardHeader className="items-center text-center">
                  <Skeleton className="h-24 w-24 rounded-full mb-4"/>
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent className="space-y-4">
                  <Skeleton className="h-10 w-full"/>
                  <Skeleton className="h-12 w-full"/>
              </CardContent>
          </Card>
      )
  }

  const xpPercentage = (companion.xp / companion.xp_to_next_level) * 100;
  const evolutionStage = getEvolutionStageForLevel(companion.level);

  const stats = [
    { name: "Energy", value: companion.energy, icon: Zap, color: "bg-cyber-cyan" },
    { name: "Happiness", value: companion.happiness, icon: Smile, color: "bg-neon-green" },
    { name: "Wealth Power", value: companion.wealth_power, icon: ShieldCheck, color: "bg-primary" },
  ];

  const characterImage = PlaceHolderImages.find(img => img.id === evolutionStage.imageId);

  return (
    <Card>
      <CardHeader className="items-center text-center">
        {characterImage && (
          <div className="mb-4">
            <Image
              src={characterImage.imageUrl}
              alt={`${evolutionStage.rank} Avatar`}
              width={evolutionStage.width}
              height={evolutionStage.height}
              data-ai-hint={characterImage.imageHint}
              priority
            />
          </div>
        )}
        <CardTitle className="pt-4 text-2xl font-bold">
          {companion.name}
        </CardTitle>
        <CardDescription className="flex items-center gap-2 text-primary">
          <Gem className="h-4 w-4" /> {evolutionStage.rank} Rank
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="mb-1 flex justify-between text-sm font-medium">
              <span className="flex items-center gap-1"><Sparkles className="h-4 w-4 text-primary" /> Level {companion.level}</span>
              <span className="text-muted-foreground">{companion.xp} / {companion.xp_to_next_level} XP</span>
            </div>
            <Progress value={xpPercentage} />
          </div>

          <div className="space-y-3 pt-2">
            {stats.map((stat) => (
              <div key={stat.name}>
                <div className="mb-1 flex justify-between text-xs font-medium">
                  <span className="flex items-center gap-1.5"><stat.icon className="h-3 w-3 text-muted-foreground"/>{stat.name}</span>
                  <span>{stat.value}%</span>
                </div>
                <Progress value={stat.value} className="h-1.5" indicatorClassName={stat.color} />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
