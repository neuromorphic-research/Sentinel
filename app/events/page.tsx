import { PageContainer, PageHeader } from "@/components/shell/Page";
import { OnDeviceBadge } from "@/components/ui/OnDeviceBadge";
import { EventLogView } from "@/components/eventdetail/EventLogView";
import { events } from "@/mock";

export default function EventsPage() {
  const sorted = [...events].sort((a, b) => b.order - a.order);

  return (
    <PageContainer>
      <PageHeader
        title="Event Log"
        subtitle="Every candidate Spike raised — verified intrusions and on-device suppressions, newest first."
        actions={<OnDeviceBadge size="sm" />}
      />
      <EventLogView events={sorted} />
    </PageContainer>
  );
}
