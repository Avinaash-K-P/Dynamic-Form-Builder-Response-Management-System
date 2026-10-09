import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  InputAdornment,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

export type FormStatusFilter = "all" | "active" | "inactive";

interface FormFiltersProps {
  search: string;
  status: FormStatusFilter;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: FormStatusFilter) => void;
  onClear: () => void;
}

function FormFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
  onClear,
}: FormFiltersProps) {
  const hasFilters =
    search.trim() !== "" || status !== "all";

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        flexWrap: "wrap",
        mb: 3,
      }}
    >
      {/* Search */}
      <TextField
        value={search}
        onChange={(event) =>
          onSearchChange(event.target.value)
        }
        placeholder="Search forms..."
        size="small"
        sx={{
          flex: 1,
          minWidth: 240,
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#FFFFFF",

            "&:hover fieldset": {
              borderColor: "#22C55E",
            },

            "&.Mui-focused fieldset": {
              borderColor: "#16A34A",
            },
          },
        }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon
                  sx={{
                    color: "#6B7280",
                  }}
                />
              </InputAdornment>
            ),
          },
        }}
      />

      {/* Status Filter */}
      <FormControl
        size="small"
        sx={{
          minWidth: 160,
        }}
      >
        <InputLabel id="form-status-filter-label">
          Status
        </InputLabel>

        <Select
          labelId="form-status-filter-label"
          value={status}
          label="Status"
          onChange={(event) =>
            onStatusChange(
              event.target.value as FormStatusFilter
            )
          }
          sx={{
            backgroundColor: "#FFFFFF",

            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#16A34A",
            },
          }}
        >
          <MenuItem value="all">
            All Status
          </MenuItem>

          <MenuItem value="active">
            Active
          </MenuItem>

          <MenuItem value="inactive">
            Inactive
          </MenuItem>
        </Select>
      </FormControl>

      {/* Clear Filters */}
      {hasFilters && (
        <Button
          variant="outlined"
          startIcon={<ClearIcon />}
          onClick={onClear}
          sx={{
            height: 40,
            color: "#166534",
            borderColor: "#86EFAC",
            textTransform: "none",
            fontWeight: 600,

            "&:hover": {
              borderColor: "#16A34A",
              backgroundColor: "#F0FDF4",
            },
          }}
        >
          Clear
        </Button>
      )}
    </Box>
  );
}

export default FormFilters;

