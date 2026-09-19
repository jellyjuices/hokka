import { Grid, GridItem } from "@/src/components/Grid";
import { PageHeader } from "@/src/components/PageHeader";
import { CaptureDropzone } from "./_components/CaptureDropzone";

export default function NewPage() {
  return (
    <Grid>
      <GridItem>
        <PageHeader
          title="New"
          icon="camera"
          description="Snap or upload a receipt. Parsing happens on device, then you confirm the fields."
        />
      </GridItem>
      <GridItem span={8} spanTablet={12}>
        <CaptureDropzone />
      </GridItem>
    </Grid>
  );
}
