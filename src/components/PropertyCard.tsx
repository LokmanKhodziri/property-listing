import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Stack,
  Chip,
} from "@mui/material";
import { formatPrice } from "@/utils/formatPrice";

export default function PropertyCard({ property }: { property: any }) {
  property = property || {};
  const { name, price, state, city, types, images } = property;

  // get first image - maybe array of url strings or array of { url } objects
  let imageUrl = "/placeholder.png";
  if (images && images.length > 0) {
    const first = images[0];
    if (typeof first === "string") imageUrl = first;
    else if (first && first.url) imageUrl = first.url;
  } else if (property.image) {
    imageUrl = property.image;
  }

  const onImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (!img.src.includes("placeholder")) img.src = "/placeholder.png";
  };

  return (
    <Card sx={{ maxWidth: 345, width: "100%" }}>
      <CardMedia
        component="img"
        height="140"
        image={imageUrl}
        alt={name || "property image"}
        onError={onImgError}
      />
      <CardContent>
        <Stack>
          <Typography gutterBottom variant='h5' component='div'>
            {name}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            {formatPrice(price)}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            {[city, state].filter(Boolean).join(", ") || "—"}
          </Typography>

          {types && types.length > 0 && types[0] && (
            <Chip label={types[0]} size='small' sx={{ width: "fit-content" }} />
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
