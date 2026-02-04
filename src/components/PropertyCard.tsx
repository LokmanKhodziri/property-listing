import { Card, CardContent, CardMedia, Typography, Stack, Chip } from "@mui/material";
import {formatPrice} from "@/utils/formatPrice";

export default function PropertryCard({ property }) {
    const { name, price, state, city, types, images } = property;

    const imageUrl = images?.[0] || '/placeholder.jpg';

    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardMedia
                component="img"
                height="140"
                image={imageUrl}
                alt={name}
            />
            <CardContent>
                <Stack>
                    <Typography gutterBottom variant="h5" component="div">
                        {name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {formatPrice(price)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {city}, {state}
                    </Typography>
                    
                    {
                        types && (
                            <Chip
                                label={types[0]}
                                size="small"
                                sx={{width: 'fit-content'}}
                            /> 
                        )
                    }
                </Stack>
            </CardContent>
        </Card>
    );
}