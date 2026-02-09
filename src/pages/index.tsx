import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  FormControl,
  FormControlLabel,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormGroup,
  Box,
} from "@mui/material";
import PropertyCard from "@/components/PropertyCard";
import PropertyCardSkeleton from "@/components/PropertyCardSkeleton";
import ErrorMessage from "@/components/ErrorMessage";

const GridAny = Grid as any;

// category options for filter
const PROPERTY_CATEGORIES = [
  { value: "all", label: "All Properties" },
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "agricultural", label: "Agricultural" },
  { value: "industrial", label: "Industrial" },
  { value: "others", label: "Others" },
];

// sort options: default per spec = earliest created date
const SORT_OPTIONS = [
  { value: "createdAt", label: "Earliest created (default)" },
  { value: "-createdAt", label: "Newest first" },
  { value: "price", label: "Price (low to high)" },
  { value: "-price", label: "Price (high to low)" },
];

export default function Home(props: any) {
  const router = useRouter();
  const { properties = [], error } = props;

  // local state for the filter form
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [searchName, setSearchName] = useState("");
  const [sort, setSort] = useState("createdAt");
  const [currentPage, setCurrentPage] = useState(1);
  const [isNavigating, setIsNavigating] = useState(false);

  // sync form from url when user go back/forward or apply filter
  useEffect(() => {
    const q = router.query;
    setMinPrice((q.minPrice as string) || "");
    setMaxPrice((q.maxPrice as string) || "");
    const typesParam = (q.types as string) || "";
    setSelectedTypes(typesParam ? typesParam.split(",").filter(Boolean) : []);
    setSearchName((q.name as string) || "");
    setSort((q.sort as string) || "createdAt");
    setCurrentPage(parseInt((q.page as string) || "1", 10));
    setIsNavigating(false);
  }, [router.query]);

  // bonus: search by name (client-side filter on current page results)
  const nameLower = searchName.trim().toLowerCase();
  const filteredProperties =
    nameLower && properties && properties.length
      ? properties.filter((p: any) => (p.name || "").toLowerCase().includes(nameLower))
      : properties || [];

  // apply filters and go back to page 1
  const handleApplyFilters = () => {
    setIsNavigating(true);
    const query: Record<string, string> = {
      page: "1",
      sort: (router.query.sort as string) || "createdAt",
    };
    if (minPrice) query.minPrice = minPrice;
    if (maxPrice) query.maxPrice = maxPrice;
    if (selectedTypes.length) query.types = selectedTypes.join(",");
    if (searchName.trim()) query.name = searchName.trim();
    router.push({ pathname: "/", query });
  };

  // when user changes sort we go to page 1 so results make sense
  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    setIsNavigating(true);
    const query: Record<string, string> = {
      ...router.query,
      page: "1",
      sort: newSort,
    } as Record<string, string>;
    router.push({ pathname: "/", query });
  };

  // pagination - keep current filters and sort, just change page
  const goToPage = (page: number) => {
    if (page < 1) return;
    setIsNavigating(true);
    const query: Record<string, string> = {
      ...router.query,
      page: String(page),
      sort: (router.query.sort as string) || "createdAt",
    } as Record<string, string>;
    router.push({ pathname: "/", query });
  };

  const handleTypeToggle = (type: string, checked: boolean) => {
    if (checked) setSelectedTypes([...selectedTypes, type]);
    else setSelectedTypes(selectedTypes.filter((t) => t !== type));
  };

  const handleRetry = () => router.push(router.asPath);

  if (error) {
    return (
      <Container sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 3 } }}>
        <Typography variant="h5" gutterBottom sx={{ fontSize: { xs: "1.5rem", sm: "2rem" } }}>
          Property Listings
        </Typography>
        <ErrorMessage onRetry={handleRetry} />
      </Container>
    );
  }

  return (

    <Container maxWidth="lg" sx={{ py: 4 }}>
    <Box sx={{ mb: 3 }}>
      <Typography variant="h4" gutterBottom fontWeight={600}>
        Property Listings
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Browse properties for sale across Malaysia.
      </Typography>
    </Box>

      {/* filters - stack on mobile */}
      <Box
        sx={{
          mb: 3,
          p: { xs: 1.5, sm: 2 },
          border: "1px solid #eee",
          borderRadius: 1,
        }}
      >
        <Typography variant="subtitle1" gutterBottom>
          Filters
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            flexWrap: "wrap",
            gap: 2,
            alignItems: "flex-start",
          }}
        >
          <TextField
            label="Search by name"
            size="small"
            placeholder="Property name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            sx={{ width: { xs: "100%", sm: 180 } }}
          />
          <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 180 } }}>
            <InputLabel id="sort-label">Sort by</InputLabel>
            <Select
              labelId="sort-label"
              label="Sort by"
              value={sort}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              {SORT_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Min price"
            type="number"
            size="small"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            sx={{ width: { xs: "100%", sm: 120 } }}
          />
          <TextField
            label="Max price"
            type="number"
            size="small"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            sx={{ width: { xs: "100%", sm: 120 } }}
          />
          <Box sx={{ width: { xs: "100%", sm: "auto" } }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Property type (multiple)
            </Typography>
            <FormGroup row sx={{ flexWrap: "wrap", gap: 0.5 }}>
              {PROPERTY_CATEGORIES.filter((o) => o.value !== "all").map((opt) => (
                <FormControlLabel
                  key={opt.value}
                  control={
                    <Checkbox
                      size="small"
                      checked={selectedTypes.includes(opt.value)}
                      onChange={(e) => handleTypeToggle(opt.value, e.target.checked)}
                    />
                  }
                  label={opt.label}
                />
              ))}
            </FormGroup>
          </Box>
          <Button
            variant="contained"
            onClick={handleApplyFilters}
            sx={{ minHeight: 40, width: { xs: "100%", sm: "auto" } }}
          >
            Apply filters
          </Button>
        </Box>
      </Box>

      {/* loading skeleton */}
      {isNavigating && (
        <GridAny container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <GridAny key={i} xs={12} sm={6} md={4} component="div">
              <PropertyCardSkeleton />
            </GridAny>
          ))}
        </GridAny>
      )}

      {/* content */}
      {!isNavigating && (!properties || !properties.length) && (
        <Typography variant="h6">No properties available</Typography>
      )}

      {!isNavigating && properties && properties.length > 0 && filteredProperties.length === 0 && (
        <Typography variant="h6">No properties match your search. Try a different name or filters.</Typography>
      )}

      {!isNavigating && properties && properties.length > 0 && filteredProperties.length > 0 && (
        <>
          <GridAny container spacing={{ xs: 2, sm: 3, md: 4 }}>
            {filteredProperties.map((property: any) => (
              <GridAny key={property.id} xs={12} sm={6} md={4} component="div">
                <PropertyCard property={property} />
              </GridAny>
            ))}
          </GridAny>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 1,
              mt: 3,
              "& .MuiButton-root": { minHeight: 44, minWidth: 44 },
            }}
          >
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

  if (!endpointBase || typeof endpointBase !== "string") {
    return { props: { properties: [], error: true } };
  }

  const { page = "1", sort = "createdAt", minPrice, maxPrice, types: typesParam } = context.query || {};

  // api wants page and sort in url only
  let url: string;
  try {
    const u = new URL(endpointBase);
    u.searchParams.set("page", String(page));
    u.searchParams.set("sort", String(sort));
    url = u.toString();
  } catch (e) {
    url = `${endpointBase}${endpointBase && endpointBase.includes("?") ? "&" : "?"}page=${encodeURIComponent(String(page))}&sort=${encodeURIComponent(String(sort))}`;
  }

  // filters go in body; API accepts multiple property types (categories)
  const body: Record<string, unknown> = {
    section: "sale",
  };
  const typesList = typesParam
    ? String(typesParam)
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean)
    : [];
  if (typesList.length) body.categories = typesList;
  const minPriceNum = minPrice ? parseInt(String(minPrice), 10) : undefined;
  const maxPriceNum = maxPrice ? parseInt(String(maxPrice), 10) : undefined;
  if (minPriceNum != null && !Number.isNaN(minPriceNum)) body.minPrice = minPriceNum;
  if (maxPriceNum != null && !Number.isNaN(maxPriceNum)) body.maxPrice = maxPriceNum;

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
