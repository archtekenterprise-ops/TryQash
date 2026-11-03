import { Container } from "@/components/layout/container";
import { PageLoading } from "@/components/layout/page-loading";

/** Route-level loading UI for the design preview page. */
export default function HomeLoading() {
  return (
    <div className="flex min-h-dvh flex-col">
      <div className="h-14 border-b border-surface bg-surface-page" />
      <Container>
        <PageLoading />
      </Container>
    </div>
  );
}
