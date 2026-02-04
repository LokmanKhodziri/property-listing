import { Container, Grid, Typography } from '@mui/material';
import PropertyCard from '@/components/PropertyCard';

const GridAny = Grid as any;

export default function Home({ properties = [], error }: { properties?: any[]; error?: boolean }) {
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

      <GridAny container spacing={4}>
        {properties.map((property) => (
          <GridAny key={property.id} xs={12} sm={6} md={4} component={"div"}>
            <PropertyCard property={property} />
          </GridAny>
        ))}
      </GridAny>
    </Container>
  );
}

export async function getServerSideProps() {
  const endpoint = process.env.PROPERTY_LISTING_ENDPOINT || process.env.NEXT_PUBLIC_PROPERTY_LISTING_ENDPOINT;

  if (!endpoint) {
    return { props: { properties: [], error: true } };
  }

  try {
    const res = await fetch(endpoint as string);
    if (!res.ok) {
      return { props: { properties: [], error: true } };
    }

    const data = await res.json();

    let properties = [];
    if (Array.isArray(data)) properties = data;
    else if (Array.isArray(data.data)) properties = data.data;
    else if (Array.isArray(data.results)) properties = data.results;
    else if (Array.isArray(data.items)) properties = data.items;
    else if (Array.isArray(data.properties)) properties = data.properties;

    return { props: { properties } };
  } catch (err) {
    return { props: { properties: [], error: true } };
  }
}
