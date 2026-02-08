import { Card, CardContent, Skeleton } from "@mui/material";

export default function PropertyCardSkeleton() {
  return (
    <Card sx={{ maxWidth: 345, width: "100%" }}>
      <Skeleton variant="rectangular" height={140} animation="wave" />
      <CardContent>
        <Skeleton variant="text" width="80%" height={28} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="40%" height={24} sx={{ mb: 0.5 }} />
        <Skeleton variant="text" width="60%" height={24} />
      </CardContent>
    </Card>
  );
}
