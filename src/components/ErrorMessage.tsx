import { Box, Typography, Button } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

type Props = {
  message?: string;
  onRetry?: () => void;
};

export default function ErrorMessage({
  message = "Something went wrong. Please try again.",
  onRetry,
}: Props) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 280,
        p: 3,
        textAlign: "center",
      }}
    >
      <ErrorOutlineIcon
        sx={{ fontSize: 56, color: "error.main", mb: 2 }}
        aria-hidden
      />
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Failed to load properties
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {message}
      </Typography>
      {onRetry && (
        <Button variant="contained" onClick={onRetry}>
          Try again
        </Button>
      )}
    </Box>
  );
}
