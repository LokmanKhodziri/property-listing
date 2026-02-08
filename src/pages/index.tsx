import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Box,
} from "@mui/material";
import PropertyCard from "@/components/PropertyCard";

const GridAny = Grid as any;

// property types we can filter by (could come from API later)
const PROPERTY_TYPES = ["House", "Apartment", "Condo", "Land"];

export default function Home(props: any) {
  const router = useRouter();
  const { properties = [], error } = props;

  // local state for the filter form
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // when router query changes (e.g. after navigation), sync our form state from URL
  useEffect(() => {
    const q = router.query;
    setMinPrice((q.minPrice as string) || "");
    setMaxPrice((q.maxPrice as string) || "");
    const typesParam = (q.types as string) || "";
    setSelectedTypes(typesParam ? typesParam.split(",").filter(Boolean) : []);
    setCurrentPage(parseInt((q.page as string) || "1", 10));
  }, [router.query]);

  // apply filters - reset to page 1 so no pagination bug
  const handleApplyFilters = () => {
    const query: Record<string, string> = {
      page: "1",
      sort: (router.query.sort as string) || "-price",
    };
    if (minPrice) query.minPrice = minPrice;
    if (maxPrice) query.maxPrice = maxPrice;
    if (selectedTypes.length) query.types = selectedTypes.join(",");
    router.push({ pathname: "/", query });
  };

  // when user toggles a property type checkbox
  const handleTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setSelectedTypes([...selectedTypes, type]);
    } else {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    }
  };

  // pagination - keep current filters, just change page
  const goToPage = (page: number) => {
    if (page < 1) return;
    const query: Record<string, string> = {
      ...router.query,
      page: String(page),
    } as Record<string, string>;
    router.push({ pathname: "/", query });
  };

  if (error) {
    return <Typography variant="h6">Failed to load properties</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Property Listings
      </Typography>

      {/* filters */}
      <Box sx={{ mb: 3, p: 2, border: "1px solid #eee", borderRadius: 1 }}>
        <Typography variant="subtitle1" gutterBottom>
          Filters
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "flex-start" }}>
          <TextField
            label="Min price"
            type="number"
            size="small"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            sx={{ width: 120 }}
          />
          <TextField
            label="Max price"
            type="number"
            size="small"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            sx={{ width: 120 }}
          />
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Property type
            </Typography>
            <FormGroup row>
              {PROPERTY_TYPES.map((type) => (
                <FormControlLabel
                  key={type}
                  control={
                    <Checkbox
                      checked={selectedTypes.includes(type)}
                      onChange={(e) => handleTypeChange(type, e.target.checked)}
                    />
                  }
                  label={type}
                />
              ))}
            </FormGroup>
          </Box>
          <Button variant="contained" onClick={handleApplyFilters}>
            Apply filters
          </Button>
        </Box>
      </Box>

      {!properties || !properties.length ? (
        <Typography variant="h6">No properties available</Typography>
      ) : (
        <>
          <GridAny container spacing={4}>
            {properties.map((property: any) => (
              <GridAny key={property.id} xs={12} sm={6} md={4} component={"div"}>
                <PropertyCard property={property} />
              </GridAny>
            ))}
          </GridAny>

          {/* pagination - prev/next so we dont need total count from API */}
          <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 3 }}>
            <Button
              variant="outlined"
              disabled={currentPage <= 1}
              onClick={() => goToPage(currentPage - 1)}
            >
              Previous
            </Button>
            <Typography sx={{ alignSelf: "center", px: 1 }}>Page {currentPage}</Typography>
            <Button variant="outlined" onClick={() => goToPage(currentPage + 1)}>
              Next
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
}

export async function getServerSideProps(context: any) {
  const endpointBase =
    process.env.PROPERTY_LISTING_ENDPOINT ||
    process.env.NEXT_PUBLIC_PROPERTY_LISTING_ENDPOINT;
  const { page = "1", sort = "-price", minPrice, maxPrice, types } = context.query || {};

  let url: string;
  try {
    const u = new URL(endpointBase);
    u.searchParams.set("page", String(page));
    u.searchParams.set("sort", String(sort));
    if (minPrice) u.searchParams.set("minPrice", String(minPrice));
    if (maxPrice) u.searchParams.set("maxPrice", String(maxPrice));
    if (types) u.searchParams.set("types", String(types));
    url = u.toString();
  } catch (e) {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("sort", String(sort));
    if (minPrice) params.set("minPrice", String(minPrice));
    if (maxPrice) params.set("maxPrice", String(maxPrice));
    if (types) params.set("types", String(types));
    url = `${endpointBase}${endpointBase && endpointBase.includes("?") ? "&" : "?"}${params.toString()}`;
  }

  const body: Record<string, unknown> = {
    page: Number(page) || 1,
    sort: String(sort),
  };
  if (minPrice) body.minPrice = Number(minPrice);
  if (maxPrice) body.maxPrice = Number(maxPrice);
  if (types) body.types = String(types).split(",").filter(Boolean);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      console.log("API returned non-ok response:", text);
      return { props: { properties: [], error: true } };
    }

    const data = await res.json();

    let properties: any = [];
    if (Array.isArray(data)) properties = data;
    else if (Array.isArray(data.items)) properties = data.items;
    else if (Array.isArray(data.data)) properties = data.data;
    else if (Array.isArray(data.results)) properties = data.results;
    else if (Array.isArray(data.properties)) properties = data.properties;

    return { props: { properties } };
  } catch (error) {
    console.log("Fetch error:", error);
    return { props: { properties: [], error: true } };
  }
}
