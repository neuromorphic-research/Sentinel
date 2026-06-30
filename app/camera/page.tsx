import type { Metadata } from "next";
import { PageContainer, PageHeader } from "@/components/shell/Page";
import { CameraGrid } from "@/components/camera/CameraGrid";
import { OnDeviceBadge } from "@/components/ui/OnDeviceBadge";
import { cameras, sites } from "@/mock";

export const metadata: Metadata = {
  title: "Cameras · Sentinel",
};

export default function CameraIndexPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Cameras"
        subtitle={`${cameras.length} cameras across ${sites.length} sites — each verifying its own alarms on-device.`}
        actions={<OnDeviceBadge />}
      />
      <CameraGrid cameras={cameras} cols="lg:grid-cols-3" linkBase="/camera" />
    </PageContainer>
  );
}
