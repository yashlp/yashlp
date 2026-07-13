import { catalogService } from "@/lib/commerce/services/catalog.service";
import { CollectionsClient } from "./collections-client";

export const metadata = { title: "Collections" };

export default async function CollectionsPage() {
  let collections: Awaited<ReturnType<typeof catalogService.getCollections>> = [];
  try {
    collections = await catalogService.getCollections();
  } catch {
    // empty
  }

  return <CollectionsClient collections={collections} />;
}
