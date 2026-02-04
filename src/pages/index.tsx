import { Container, Grid, Typography } from '@mui/material';
import PropertryCard from '@/components/PropertyCard';

export default function Home({ properties = [], error }) {
  if (error) {
    return <Typography variant="h6">Failed to load properties</Typography>;
  }

  if (!properties.length) {
    return <Typography variant="h6">No properties available</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Property Listings
      </Typography>

      <Grid container spacing={4}>
        {properties.map((property) => (
          <Grid item key={property.id} xs={12} sm={6} md={4}>
            <PropertryCard property={property} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
