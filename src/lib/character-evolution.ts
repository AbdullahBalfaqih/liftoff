export type Rank = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';

export type EvolutionStage = {
    rank: Rank;
    imageId: string;
    width: number;
    height: number;
};

const evolutionStages: Record<string, EvolutionStage> = {
    '1-5': { rank: 'Bronze', imageId: 'bronze-avatar', width: 80, height: 80 },
    '6-10': { rank: 'Silver', imageId: 'silver-avatar', width: 100, height: 100 },
    '11-15': { rank: 'Gold', imageId: 'gold-avatar', width: 120, height: 120 },
    '16-20': { rank: 'Platinum', imageId: 'platinum-avatar', width: 150, height: 150 },
    '21+': { rank: 'Diamond', imageId: 'diamond-avatar', width: 180, height: 180 },
};

export function getEvolutionStageForLevel(level: number): EvolutionStage {
    if (level <= 5) return evolutionStages['1-5'];
    if (level <= 10) return evolutionStages['6-10'];
    if (level <= 15) return evolutionStages['11-15'];
    if (level <= 20) return evolutionStages['16-20'];
    return evolutionStages['21+'];
}
