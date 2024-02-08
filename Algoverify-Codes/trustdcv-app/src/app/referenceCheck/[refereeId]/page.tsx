import dynamic from "next/dynamic";

const ReferenceCheckPage = dynamic(
  () => import("@/components/reference-check/ReferenceCheckPage")
);

export default function ReferencePage() {
  return <ReferenceCheckPage />;
}
export async function generateStaticParams() {
  return [{ refereeId: "1" }, { refereeId: "index" }];
}
