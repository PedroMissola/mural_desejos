import HomeClient from "@/components/home-client";
import { constructMetadata } from "@/lib/metadata-utils";

export async function generateMetadata(props) {
  const searchParams = await props.searchParams;
  return await constructMetadata({ searchParams });
}

export default function Page() {
  return <HomeClient />;
}