import HomeClient from "@/components/home-client";
import { constructMetadata } from "@/lib/metadata-utils";

export async function generateMetadata({ searchParams }) {
  return await constructMetadata({ searchParams });
}

export default function Page() {
  return <HomeClient />;
}