import CompanionHub from "@/components/companion-hub";
import ChallengesPanel from "@/components/dashboard/challenges";

export default function MissionsPage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-8">
      <CompanionHub />
      <div className="w-full max-w-md">
        <ChallengesPanel />
      </div>
    </div>
  );
}
