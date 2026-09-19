import { TaxSettingsProvider } from "@/src/context/TaxSettings";
import { DashboardView } from "./_components/DashboardView";

export default function DashboardPage() {
  return (
    <TaxSettingsProvider>
      <DashboardView />
    </TaxSettingsProvider>
  );
}
