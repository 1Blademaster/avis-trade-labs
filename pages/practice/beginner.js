import Practice from "@/components/practice";

export default function BeginnerPractice() {
  return <Practice backendUrl="/api/hello" startBalance={10000} target={500} />;
}
