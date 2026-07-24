export default function createDefaultStages() {
  return [
    {
      id: "github",
      status: "pending",
    },
    {
      id: "actions",
      status: "pending",
    },
    {
      id: "s3",
      status: "pending",
    },
    {
      id: "cloudfront",
      status: "pending",
    },
  ];
}