import { Card, Text, Button } from "@mantine/core"

export default function Practice() {
  return (
    <div className="overflow-x-hidden">
      <div className="flex w-screen justify-center gap-x-8 w-3/4 m-4">
        <Card shadow="sm" padding="lg" radius="md" withborder className="bg-slate-800">
          <Text size="sm" color="dimmed">
            Something about a practice mode
          </Text>

          <Button variant="light" color="blue" fullWidth mt="md" radius="md">
            Practice Now
          </Button>
        </Card>
      </div>
    </div>
  )
}