import Practice from "@/components/practice";

export default function BeginnerPractice() {
  return <Practice backendUrl="/api/hello" startBalance={1000} target={1000} />;
}
