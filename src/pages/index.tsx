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
  Radio,
  RadioGroup,
  Box,
} from "@mui/material";
import PropertyCard from "@/components/PropertyCard";

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

// sort options for dropdown
const SORT_OPTIONS = [
  { value: "-price", label: "Price (high to low)" },
  { value: "price", label: "Price (low to high)" },
  { value: "-createdAt", label: "Newest first" },
  { value: "createdAt", label: "Oldest first" },
];

export default function Home(props: any) {
  const router = useRouter();
  const { properties = [], error } = props;

  // local state for the filter form
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("-price");
  const [currentPage, setCurrentPage] = useState(1);

  // sync form from url when user go back/forward or apply filter
  useEffect(() => {
    const q = router.query;
    setMinPrice((q.minPrice as string) || "");
    setMaxPrice((q.maxPrice as string) || "");
    setCategory((q.category as string) || "all");
    setSort((q.sort as string) || "-price");
    setCurrentPage(parseInt((q.page as string) || "1", 10));
  }, [router.query]);

  // apply filters and go back to page 1
  const handleApplyFilters = () => {
    const query: Record<string, string> = {
      page: "1",
      sort: (router.query.sort as string) || "-price",
    };
    if (minPrice) query.minPrice = minPrice;
    if (maxPrice) query.maxPrice = maxPrice;
    if (category && category !== "all") query.category = category;
    router.push({ pathname: "/", query });
  };

  // when user changes sort we go to page 1 so results make sense
  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    const query: Record<string, string> = {
      ...router.query,
      page: "1",
      sort: newSort,
    } as Record<string, string>;
    router.push({ pathname: "/", query });
  };

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
          <FormControl size="small" sx={{ minWidth: 180 }}>
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
              Property Category
            </Typography>
            <RadioGroup
              row
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {PROPERTY_CATEGORIES.map((opt) => (
                <FormControlLabel
                  key={opt.value}
                  value={opt.value}
                  control={<Radio size="small" />}
                  label={opt.label}
                />
              ))}
            </RadioGroup>
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

          {/* prev next buttons */}
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
  const { page = "1", sort = "-price", minPrice, maxPrice, category } = context.query || {};

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

  // filters go in body
  const body: Record<string, unknown> = {
    section: "sale",
  };
  const categoryVal = category && String(category).toLowerCase();
  if (categoryVal && categoryVal !== "all") {
    body.categories = [categoryVal];
  }
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
