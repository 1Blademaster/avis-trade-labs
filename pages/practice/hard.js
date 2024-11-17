import Practice from "@/components/practice";

export default function BeginnerPractice() {
  return <Practice backendUrl="/api/hello" startBalance={100} target={1000} />;
}
