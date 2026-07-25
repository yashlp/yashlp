import { redirect } from "next/navigation";
import { isAestheticsOnlyDeploy } from "@/lib/commerce/aesthetics-surface";
import CivicHomePage from "@/components/civic/civic-home-page";

/**
 * On Only Aesthetic hosts / PRODUCT_SURFACE=aesthetics, never mount CivicLens.
 * CivicLens map home is only used on the CivicLens project.
 */
export default function HomePage() {
  if (isAestheticsOnlyDeploy()) {
    redirect("/aesthetics");
  }
  return <CivicHomePage />;
}
