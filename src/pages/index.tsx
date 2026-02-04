import { Container, Grid, Typography } from "@mui/material";
import PropertyCard from "@/components/PropertyCard";

const GridAny = Grid as any;

export default function Home(props: any) {
  console.log("Home props:", props);
  const { properties = [], error } = props;

  if (error) {
    console.log("Error while loading properties");
    return <Typography variant='h6'>Failed to load properties</Typography>;
  }

  if (!properties || !properties.length) {
    console.log("No properties found");
    return <Typography variant='h6'>No properties available</Typography>;
  }

  return (
    <Container>
      <Typography variant='h4' gutterBottom>
        Property Listings
      </Typography>

      <GridAny container spacing={4}>
        {properties.map((property: any) => (
          <GridAny key={property.id} xs={12} sm={6} md={4} component={"div"}>
            <PropertyCard property={property} />
          </GridAny>
        ))}
      </GridAny>
    </Container>
  );
}

export async function getServerSideProps(context: any) {
  const endpointBase =
    process.env.PROPERTY_LISTING_ENDPOINT ||
    process.env.NEXT_PUBLIC_PROPERTY_LISTING_ENDPOINT;
  const { page = "1", sort = "-price" } = context.query || {};

  let url: string;
  try {
    const u = new URL(endpointBase);
    u.searchParams.set("page", String(page));
    u.searchParams.set("sort", String(sort));
    url = u.toString();
  } catch (e) {
    url = `${endpointBase}${endpointBase && endpointBase.includes("?") ? "&" : "?"}page=${encodeURIComponent(
      String(page),
    )}&sort=${encodeURIComponent(String(sort))}`;
  }

  console.log("Fetching properties from", url);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    console.log("API response status:", res.status);
    if (!res.ok) {
      const text = await res.text();
      console.log("API returned non-ok response:", text);
      return { props: { properties: [], error: true } };
    }

    const data = await res.json();
    console.log("API response (json):", data);

    let properties: any = [];
    if (Array.isArray(data)) properties = data;
    else if (Array.isArray(data.items)) properties = data.items;
    else if (Array.isArray(data.data)) properties = data.data;
    else if (Array.isArray(data.results)) properties = data.results;
    else if (Array.isArray(data.properties)) properties = data.properties;

    console.log("Parsed properties count:", properties.length);

    // TODO: handle pagination, filters, and other shapes

    return { props: { properties } };
  } catch (error) {
    console.log("Fetch error:", error);
    return { props: { properties: [], error: true } };
  }
}
