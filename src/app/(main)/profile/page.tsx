import UserProfilePanel from "@/components/dashboard/user-profile-panel";
import IncomeSettingsPanel from "@/components/dashboard/income-settings";
import SmartComparisonPanel from "@/components/dashboard/smart-comparison";

export default function ProfilePage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <UserProfilePanel />
      <IncomeSettingsPanel />
      <SmartComparisonPanel />
    </div>
  );
}
