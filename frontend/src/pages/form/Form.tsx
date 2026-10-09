import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { toast } from "react-toastify";

import FormFilters, {
  type FormStatusFilter,
} from "../../components/forms/FormFilters";

import CreateFormModal from "../../components/forms/CreateFormModal";
import FormTable from "../../components/forms/FormTable";
import EditFormModal from "../../components/forms/EditFormModal";
import DeleteConfirmDialog from "../../components/forms/DeleteConfirmDialog";

import {
  getForms,
  deleteForm,
  type FormResponse,
} from "../../services/formService";

import "../../styles/form.css";

function Forms() {
  /* =========================================================
     STATE
  ========================================================= */

  const navigate = useNavigate();

  const [forms, setForms] = useState<FormResponse[]>([]);

  const [search, setSearch] = useState("");

  const [status, setStatus] =
    useState<FormStatusFilter>("all");

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState("");

  const [isCreateModalOpen, setIsCreateModalOpen] =
    useState(false);

  const [selectedForm, setSelectedForm] =
    useState<FormResponse | null>(null);  

  const [isEditModalOpen, setIsEditModalOpen] =
    useState(false);  

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] =
    useState(false);  

  const [isDeleting, setIsDeleting] =
    useState(false);

  /* =========================================================
     LOAD FORMS
  ========================================================= */

  const loadForms = async () => {
    try {
      setIsLoading(true);
      setError("");

      const data = await getForms();

      setForms(data);
    } catch (error: any) {
      const message =
        error?.response?.data?.detail ||
        "Failed to load forms.";

      setError(message);

      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };


  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    loadForms();
  }, []);


  /* =========================================================
     FILTER FORMS
  ========================================================= */

  const filteredForms = useMemo(() => {
    const searchValue = search
      .trim()
      .toLowerCase();

    return forms.filter((form) => {
      const matchesSearch =
        searchValue === "" ||
        form.title.toLowerCase().includes(searchValue) ||
        (form.description ?? "")
          .toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        status === "all" ||
        (status === "active" && form.is_active) ||
        (status === "inactive" && !form.is_active);

      return matchesSearch && matchesStatus;
    });
  }, [forms, search, status]);


  /* =========================================================
     CREATE FORM SUCCESS
  ========================================================= */

  const handleCreateSuccess = (
    createdForm: FormResponse
  ) => {
    setForms((previousForms) => [
      createdForm,
      ...previousForms,
    ]);
  };


  /* =========================================================
     CLEAR FILTERS
  ========================================================= */

  const handleClearFilters = () => {
    setSearch("");
    setStatus("all");
  };


  /* =========================================================
     EDIT FORM
  ========================================================= */

const handleEdit = (form: FormResponse) => {
  setSelectedForm(form);
  setIsEditModalOpen(true);
};

const handleEditSuccess = (updatedForm: FormResponse) => {
  setForms((previousForms) =>
    previousForms.map((form) =>
      form.id === updatedForm.id
        ? updatedForm
        : form
    )
  );
};


  /* =========================================================
     OPEN FORM BUILDER
  ========================================================= */

const handleBuilder = (form: FormResponse) => {
  navigate(`/forms/${form.id}/builder`);
};

  /* =========================================================
     DELETE FORM
  ========================================================= */

  const handleDelete = (form: FormResponse) => {
    setSelectedForm(form);
    setIsDeleteDialogOpen(true);
  };

const handleDeleteConfirm = async () => {
  if (!selectedForm) return;

  try {
    setIsDeleting(true);

    await deleteForm(selectedForm.id);

    setForms((previousForms) =>
      previousForms.filter(
        (form) => form.id !== selectedForm.id
      )
    );

    toast.success("Form deleted successfully!");

    setIsDeleteDialogOpen(false);
    setSelectedForm(null);
  } catch (error: any) {
    const message =
      error?.response?.data?.detail ||
      "Failed to delete form. Please try again.";

    toast.error(message);
  } finally {
    setIsDeleting(false);
  }
};

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <Box className="forms-page">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <Box className="forms-page-header">

        <Box className="forms-page-title-section">

          <Typography
            component="h1"
            className="forms-page-title"
          >
            Forms
          </Typography>

          <Typography
            component="p"
            className="forms-page-subtitle"
          >
            Create, manage, and configure your dynamic forms.
          </Typography>

        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          className="forms-create-button"
          onClick={() => setIsCreateModalOpen(true)}
          sx={{
            backgroundColor: "#16A34A",
            textTransform: "none",
            fontWeight: 600,
            px: 2.5,
            py: 1.1,

            "&:hover": {
              backgroundColor: "#15803D",
            },
          }}
        >
          Create Form
        </Button>

      </Box>


      {/* =====================================================
          FILTERS
      ===================================================== */}

      <Box className="forms-filter-section">

        <FormFilters
          search={search}
          status={status}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          onClear={handleClearFilters}
        />

      </Box>


      {/* =====================================================
          LOADING
      ===================================================== */}

      {isLoading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 250,
          }}
        >
          <CircularProgress
            sx={{
              color: "#16A34A",
            }}
          />
        </Box>
      )}


      {/* =====================================================
          ERROR
      ===================================================== */}

      {!isLoading && error && (
        <Box className="forms-empty-state">

          <Typography
            component="h3"
            sx={{
              color: "#DC2626",
              fontWeight: 600,
              mb: 1,
            }}
          >
            Unable to load forms
          </Typography>

          <Typography
            component="p"
            sx={{
              color: "#6B7280",
              mb: 2,
            }}
          >
            {error}
          </Typography>

          <Button
            variant="outlined"
            onClick={loadForms}
            sx={{
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
            Try Again
          </Button>

        </Box>
      )}


      {/* =====================================================
          FORM TABLE
      ===================================================== */}

      {!isLoading && !error && (
        <FormTable
          forms={filteredForms}
          onEdit={handleEdit}
          onBuilder={handleBuilder}
          onDelete={handleDelete}
        />
      )}


      {/* =====================================================
          RESULT / EMPTY INFORMATION
      ===================================================== */}

      {!isLoading &&
        !error &&
        forms.length > 0 &&
        filteredForms.length === 0 && (
          <Box
            sx={{
              textAlign: "center",
              py: 5,
            }}
          >
            <Typography
              sx={{
                color: "#374151",
                fontWeight: 600,
                mb: 0.5,
              }}
            >
              No matching forms
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "#6B7280",
              }}
            >
              Try changing your search or status filter.
            </Typography>
          </Box>
        )
      }


      {/* =====================================================
          CREATE FORM MODAL
      ===================================================== */}

      <CreateFormModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      <EditFormModal
        open={isEditModalOpen}
        form={selectedForm}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedForm(null);
        }}
        onSuccess={handleEditSuccess}
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        form={selectedForm}
        loading={isDeleting}
        onClose={() => {
          if (isDeleting) return;
        
          setIsDeleteDialogOpen(false);
          setSelectedForm(null);
        }}
        onConfirm={handleDeleteConfirm}
      />

    </Box>
  );
}

export default Forms;