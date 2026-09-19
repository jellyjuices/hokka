import { Grid, GridItem } from "@/src/components/Grid";
import { PageHeader } from "@/src/components/PageHeader";
import { TaxSettingsProvider } from "@/src/context/TaxSettings";
import { SettingsForm } from "./_components/SettingsForm";

export default function SettingsPage() {
  return (
    <TaxSettingsProvider>
      <Grid>
        <GridItem>
          <PageHeader
            title="Settings"
            icon="settings"
            description="Rate, filing frequency, reserve percentage, and fiscal year."
          />
        </GridItem>
        <GridItem span={8} spanTablet={12}>
          <SettingsForm />
        </GridItem>
      </Grid>
    </TaxSettingsProvider>
  );
}
