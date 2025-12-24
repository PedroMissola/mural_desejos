import { Suspense } from "react"; // 1. Importe o Suspense
import HomeClient from "@/components/home-client";
import { constructMetadata } from "@/lib/metadata-utils";

export async function generateMetadata(props) {
  const searchParams = await props.searchParams;
  return await constructMetadata({ searchParams });
}

export default function Page() {
  return (
    <Suspense fallback={<div className="w-full h-screen bg-[#0B1224]" />}>
      <HomeClient />
    </Suspense>
  );
}