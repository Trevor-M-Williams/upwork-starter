import { MapView } from "@/components/map-view";

export default async function DashboardPage() {
  return (
    <div className="flex grow w-full">
      <MapView />
    </div>
  );
}
