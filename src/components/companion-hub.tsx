'use client';

import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';
import { getEvolutionStageForLevel } from '@/lib/character-evolution';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Shield, PiggyBank, Zap, Gem, Plus, Star, Grid, Bot } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from '@/components/ui/skeleton';

export default function CompanionHub() {
    const { companion, loading } = useAppContext();
    const { toast } = useToast();
    
    const handleActionClick = (action: string) => {
        toast({
            title: `${action} Clicked`,
            description: "This feature is for demonstration purposes.",
        });
    };

    if (loading) {
        return (
            <div className="w-full max-w-md mx-auto flex flex-col gap-6 p-4">
                <Skeleton className="h-40 w-full rounded-2xl" />
                <Skeleton className="h-52 w-full" />
                <Skeleton className="h-20 w-full" />
                 <Skeleton className="h-12 w-full" />
            </div>
        )
    }

    if (!companion) {
        return (
            <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center gap-4 p-6 h-96 bg-card rounded-2xl text-center">
                 <Bot className="w-16 h-16 text-muted-foreground" />
                 <h3 className="text-xl font-bold">Companion Not Found</h3>
                 <p className="text-muted-foreground">
                    Could not load your companion's data. It might not have been created yet. Please try logging out and in again.
                </p>
            </div>
        );
    }

    const evolutionStage = getEvolutionStageForLevel(companion.level);
    const characterImage = PlaceHolderImages.find(img => img.id === evolutionStage.imageId);
    const xpPercentage = (companion.xp / companion.xp_to_next_level) * 100;
    
    const stats = [
        { name: "WEALTH", value: companion.wealth_power },
        { name: "HAPPY", value: companion.happiness },
    ];
    
    return (
        <div className="w-full max-w-md mx-auto flex flex-col gap-6 text-foreground p-4 rounded-3xl" style={{
            backgroundImage: `
                linear-gradient(rgba(10, 10, 10, 0.9), rgba(10, 10, 10, 0.9)),
                repeating-linear-gradient(0deg, transparent, transparent 49px, hsl(var(--border) / 0.2) 50px),
                repeating-linear-gradient(90deg, transparent, transparent 49px, hsl(var(--border) / 0.2) 50px)
            `,
            backgroundSize: '100% 100%, 50px 50px, 50px 50px',
            border: '1px solid hsl(var(--border) / 0.2)'
        }}>
            
            {/* Rank Status Card */}
            <div className="w-full rounded-2xl border border-primary/20 bg-card/50 p-4 backdrop-blur-sm">
                <div className="flex justify-between items-baseline mb-2">
                    <span className="text-xs text-muted-foreground">RANK STATUS</span>
                    <span className="text-xs text-muted-foreground">XP UNITS</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-3xl font-bold text-foreground">Level {companion.level}</h2>
                    <p className="font-mono text-muted-foreground">{companion.xp} / {companion.xp_to_next_level}</p>
                </div>
                <Progress value={xpPercentage} indicatorClassName="bg-primary" className="h-2"/>
                 <div className="mt-3 flex gap-2">
                    {[...Array(7)].map((_, i) => (
                        <div key={i} className={`h-1.5 flex-1 rounded-full ${i < Math.floor(xpPercentage / 14) ? 'bg-primary' : 'bg-muted/30'}`}></div>
                    ))}
                 </div>
                 <p className="text-center text-xs text-muted-foreground mt-2">CORE SYNCHRONIZATION: {companion.energy}%</p>
            </div>

            {/* Companion View */}
            <div className="relative w-full flex items-center justify-center h-52">
                {characterImage && (
                    <Image
                        src={characterImage.imageUrl}
                        alt={`${evolutionStage.rank} Avatar`}
                        width={140}
                        height={140}
                        className="z-10 drop-shadow-[0_0_15px_hsl(var(--primary)_/_0.6)]"
                        data-ai-hint={characterImage.imageHint}
                        priority
                    />
                )}
                <div className="absolute top-1/2 left-0 -translate-y-1/2 space-y-6">
                    {stats.map(stat => (
                        <div key={stat.name} className="text-center w-20 rounded-lg bg-card/50 p-2 border border-primary/20 backdrop-blur-sm">
                            <p className="text-xs text-muted-foreground">{stat.name}</p>
                            <p className="text-xl font-bold">{stat.value}%</p>
                             <div className="w-full h-1 bg-muted/30 rounded-full mt-1"><div className="h-1 bg-primary rounded-full" style={{width: `${stat.value}%`}}></div></div>
                        </div>
                    ))}
                </div>

                 <div className="absolute top-1/2 right-0 -translate-y-1/2 space-y-3">
                     <Button size="icon" variant="outline" className="rounded-full border-primary/30 bg-card/50 backdrop-blur-sm" onClick={() => handleActionClick('Shield')}><Shield className="text-primary"/></Button>
                     <Button size="icon" variant="outline" className="rounded-full border-primary/30 bg-card/50 backdrop-blur-sm" onClick={() => handleActionClick('PiggyBank')}><PiggyBank className="text-primary"/></Button>
                     <Button size="icon" variant="outline" className="rounded-full border-primary/30 bg-card/50 backdrop-blur-sm" onClick={() => handleActionClick('Zap')}><Zap className="text-primary"/></Button>
                 </div>
                 {/* Blue circular background */}
                 <div className="absolute w-52 h-52 bg-primary/20 rounded-full blur-2xl z-0"></div>
            </div>

            {/* Completed Tasks */}
            <div className="w-full space-y-2">
                 <div className="flex items-center gap-3 rounded-full border border-primary/20 bg-card/50 p-2.5 text-sm backdrop-blur-sm">
                    <div className="flex items-center justify-center h-6 w-6 bg-primary/20 rounded-full">
                      <Plus className="h-4 w-4 text-primary" />
                    </div>
                    <span className="flex-1 text-muted-foreground">Saved 50 SAR</span>
                    <span className="font-bold text-primary">+10 XP</span>
                </div>
                 <div className="flex items-center gap-3 rounded-full border border-primary/20 bg-card/50 p-2.5 text-sm backdrop-blur-sm">
                    <div className="flex items-center justify-center h-6 w-6 bg-primary/20 rounded-full">
                        <Star className="h-4 w-4 text-primary" />
                    </div>
                    <span className="flex-1 text-muted-foreground">Daily Goal</span>
                    <span className="font-bold text-primary">+5 XP</span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full grid grid-cols-3 gap-3">
                <Button variant="outline" className="h-12 border-primary/30 bg-card/50 text-base backdrop-blur-sm" onClick={() => handleActionClick('Train')}>
                    <Zap className="mr-2" /> Train
                </Button>
                <Button variant="default" className="h-12 text-base shadow-[0_0_20px] shadow-primary/50" onClick={() => handleActionClick('Equip')}>
                    <Grid className="mr-2" /> Equip
                </Button>
                 <Button variant="outline" className="h-12 border-primary/30 bg-card/50 text-base backdrop-blur-sm" onClick={() => handleActionClick('Evo')}>
                    <Gem className="mr-2" /> Evo
                </Button>
            </div>
        </div>
    );
}
