import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { toast } from "react-toastify";

import {
  getForm,
  getFormFields,
  deleteFormField,
  updateFormField,
  updateFormStatus,
} from "../../services/formService";

import type {
  FormResponse,
  FormFieldResponse,
} from "../../services/formService";


import FormFieldCard from "../../components/forms/FormFieldCard";
import AddFieldModal from "../../components/forms/AddFieldModal";
import EditFieldModal from "../../components/forms/EditFieldModal";
import FieldOptions from "../../components/forms/FieldOptions";

import "/src/styles/formbuilder.css"

function FormBuilder() {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormResponse | null>(null);
  const [fields, setFields] = useState<FormFieldResponse[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [addFieldOpen, setAddFieldOpen] = useState(false);
  const [editFieldOpen, setEditFieldOpen] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);

  const [selectedField, setSelectedField] =
    useState<FormFieldResponse | null>(null);

  // Drag-and-drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  // Load form and fields
  const loadBuilder = async () => {
    if (!formId) return;

    try {
      setLoading(true);
      setError("");

      const id = Number(formId);

      const [formData, fieldData] = await Promise.all([
        getForm(id),
        getFormFields(id),
      ]);

      setForm(formData);
      setFields(
        [...fieldData].sort(
          (a, b) => a.display_order - b.display_order
        )
      );
    } catch {
      setError("Failed to load form builder");
      toast.error("Failed to load form");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBuilder();
  }, [formId]);

  // Add field success
  const handleFieldAdded = (field: FormFieldResponse) => {
    setFields((current) =>
      [...current, field].sort(
        (a, b) => a.display_order - b.display_order
      )
    );

    setAddFieldOpen(false);
  };

  // Open edit field
  const handleEditField = (field: FormFieldResponse) => {
    setSelectedField(field);
    setEditFieldOpen(true);
  };

  // Edit field success
  const handleFieldUpdated = (updatedField: FormFieldResponse) => {
    setFields((current) =>
      current.map((field) =>
        field.id === updatedField.id ? updatedField : field
      )
    );

    setEditFieldOpen(false);
    setSelectedField(null);
  };

  // Open field options
  const handleFieldOptions = (field: FormFieldResponse) => {
    setSelectedField(field);
    setOptionsOpen(true);
  };

  // Delete field
  const handleDeleteField = async (field: FormFieldResponse) => {
    if (!formId) return;

    const confirmed = window.confirm(
      `Delete "${field.label}"?`
    );

    if (!confirmed) return;

    try {
      await deleteFormField(Number(formId), field.id);

      setFields((current) =>
        current.filter((item) => item.id !== field.id)
      );

      toast.success("Field deleted");
    } catch {
      toast.error("Failed to delete field");
    }
  };

  // Update form active/inactive status

const handleFormStatus = async () => {
  if (!form || !formId) return;

  try {
    const response = await updateFormStatus(
      Number(formId),
      {
        is_active: !form.is_active,
      }
    );

    if ("is_active" in response) {
      setForm(response);

      toast.success(
        response.is_active
          ? "Form activated"
          : "Form deactivated"
      );
    } else {
      toast.success(response.message);
    }
  } catch {
    toast.error("Failed to update form status");
  }
};



  // Drag-and-drop field reorder
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id || !formId) {
      return;
    }

    const oldIndex = fields.findIndex(
      (field) => field.id === active.id
    );

    const newIndex = fields.findIndex(
      (field) => field.id === over.id
    );

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    const reorderedFields = arrayMove(
      fields,
      oldIndex,
      newIndex
    ).map((field, index) => ({
      ...field,
      display_order: index + 1,
    }));

    // Update UI immediately
    setFields(reorderedFields);

    try {
      await Promise.all(
        reorderedFields.map((field) =>
          updateFormField(Number(formId), field.id, {
            display_order: field.display_order,
          })
        )
      );

      toast.success("Field order updated");
    } catch {
      toast.error("Failed to save field order");

      // Reload original server state
      loadBuilder();
    }
  };

  // Close options dialog
  const handleOptionsClose = () => {
    setOptionsOpen(false);
    setSelectedField(null);
  };

  // Close edit dialog
  const handleEditClose = () => {
    setEditFieldOpen(false);
    setSelectedField(null);
  };

  // Back to forms
  const handleBack = () => {
    navigate("/forms");
  };


return (
  <div className="form-builder-page">

    {/* Header */}
    <div className="form-builder-header">
      <div className="form-builder-header-left">
        <button
          className="form-builder-back"
          onClick={handleBack}
        >
          ← Back to Forms
        </button>

        <div className="form-builder-title-section">
          <h1 className="form-builder-title">
            {form?.title || "Form Builder"}
          </h1>

          <p className="form-builder-subtitle">
            Build and configure your form
          </p>
        </div>
      </div>

      {form && (
        <button
          className={`form-builder-status ${
            form.is_active ? "active" : "inactive"
          }`}
          onClick={handleFormStatus}
        >
          {form.is_active ? "Active" : "Inactive"}
        </button>
      )}
    </div>

    {/* Loading */}
    {loading && (
      <div className="form-builder-loading">
        <p>Loading form builder...</p>
      </div>
    )}

    {/* Error */}
    {!loading && error && (
      <div className="form-builder-error">
        <p>{error}</p>

        <button onClick={loadBuilder}>
          Retry
        </button>
      </div>
    )}

    {/* Builder */}
    {!loading && !error && (
      <div className="form-builder-content">

        {/* Left Sidebar */}
        <aside className="form-builder-sidebar">
          <div className="field-types-panel">
            <h3 className="field-types-title">
              FIELD TYPES
            </h3>

            <p className="field-types-description">
              Add fields to your form
            </p>

            <div className="field-types-list">
              {[
                "text",
                "number",
                "email",
                "date",
                "dropdown",
                "checkbox",
                "radio",
                "file",
                "rating",
              ].map((type) => (
                <button
                  key={type}
                  className="field-type-item"
                  onClick={() => setAddFieldOpen(true)}
                >
                  <span className="field-type-icon">
                    +
                  </span>

                  <span className="field-type-label">
                    {type === "radio"
                      ? "Radio Button"
                      : type === "file"
                      ? "File Upload"
                      : type.charAt(0).toUpperCase() +
                        type.slice(1)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Workspace */}
        <main className="form-builder-workspace">
          <div className="form-fields-panel">

            <div className="form-fields-header">
              <div>
                <h2 className="form-fields-title">
                  Form Fields
                </h2>

                <span className="form-fields-count">
                  {fields.length}{" "}
                  {fields.length === 1 ? "field" : "fields"}
                </span>
              </div>

              <button
                className="form-builder-add-field"
                onClick={() => setAddFieldOpen(true)}
              >
                + Add Field
              </button>
            </div>

            {fields.length === 0 ? (
              <div className="form-builder-empty">
                <div className="form-builder-empty-icon">
                  +
                </div>

                <h3 className="form-builder-empty-title">
                  No fields yet
                </h3>

                <p className="form-builder-empty-text">
                  Add your first field to start building
                  this form.
                </p>

                <button
                  className="form-builder-add-field"
                  onClick={() => setAddFieldOpen(true)}
                >
                  + Add Field
                </button>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={fields.map((field) => field.id)}
                  strategy={verticalListSortingStrategy}
                >
                <div className="form-fields-list">

                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="form-field-item"
                  >
                    <FormFieldCard
                      field={field}
                      index={index}
                      onEdit={() => handleEditField(field)}
                      onDelete={() => handleDeleteField(field)}
                      onOptions={() => handleFieldOptions(field)}
                    />
                  </div>
                ))}

                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>
        </main>
      </div>
    )}

    {/* Add Field */}
    {formId && (
      <AddFieldModal
        open={addFieldOpen}
        formId={Number(formId)}
        existingFields={fields}
        onClose={() => setAddFieldOpen(false)}
        onSuccess={handleFieldAdded}
      />
    )}

    {/* Edit Field */}
    {formId && (
      <EditFieldModal
        open={editFieldOpen}
        formId={Number(formId)}
        field={selectedField}
        existingFields={fields}
        onClose={handleEditClose}
        onSuccess={handleFieldUpdated}
      />
    )}

    {/* Field Options */}
    {formId && (
      <FieldOptions
        open={optionsOpen}
        formId={Number(formId)}
        field={selectedField}
        onClose={handleOptionsClose}
      />
    )}
  </div>
);

}

export default FormBuilder;
