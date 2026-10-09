import api from "./api";

/* =========================================================
   FORM TYPES
========================================================= */

export interface FormCreate {
  title: string;
  description?: string;
}

export interface FormUpdate {
  title?: string;
  description?: string;
}

export interface FormStatusUpdate {
  is_active: boolean;
}

export interface FormResponse {
  id: number;
  title: string;
  description?: string;
  created_by: number;
  is_active: boolean;
  created_at: string;
  updated_at?: string | null;
}


/* =========================================================
   FORM FIELD TYPES
========================================================= */

export interface ValidationRules {
  min_length?: number;
  max_length?: number;
  pattern?: string;

  min?: number;
  max?: number;
  integer_only?: boolean;

  min_date?: string;
  max_date?: string;

  min_selections?: number;
  max_selections?: number;

  allowed_extensions?: string[];
  max_size_mb?: number;
  step?:number;
  accept?:string;
}

export interface ConditionalLogic {
  field_id: number;
  operator:
    | "equals"
    | "not_equals"
    | "contains"
    | "not_contains"
    | "greater_than"
    | "less_than"
    | "greater_than_or_equal"
    | "less_than_or_equal"
    | "is_empty"
    | "is_not_empty";
  value?: string | number | boolean | null;
}

export interface FormFieldCreate {
  label: string;
  field_type: string;
  placeholder?: string;
  description?: string;
  is_required?: boolean;
  display_order: number;
  validation_rules?: ValidationRules;
  conditional_logic?: ConditionalLogic;
}

export interface FormFieldUpdate {
  label?: string;
  field_type?: string;
  placeholder?: string;
  description?: string;
  is_required?: boolean;
  display_order?: number;
  validation_rules?: ValidationRules;
  conditional_logic?: ConditionalLogic;
}

export interface FormFieldResponse {
  id: number;
  form_id: number;
  label: string;
  field_type: string;
  placeholder?: string | null;
  description?: string | null;
  is_required: boolean;
  display_order: number;
  validation_rules?: ValidationRules | null;
  conditional_logic?: ConditionalLogic | null;
  created_at: string;
  updated_at?: string | null;
}


/* =========================================================
   FIELD OPTION TYPES
========================================================= */

export interface FieldOptionCreate {
  label: string;
  value: string;
  display_order: number;
}

export interface FieldOptionUpdate {
  label?: string;
  value?: string;
  display_order?: number;
}

export interface FieldOptionStatusUpdate {
  is_active: boolean;
}

export interface FieldOptionResponse {
  id: number;
  field_id: number;
  label: string;
  value: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at?: string | null;
}


/* =========================================================
   FORM APIs
========================================================= */

/**
 * Create a new form
 * POST /forms/
 */
export const createForm = async (
  data: FormCreate
): Promise<FormResponse> => {
  const response = await api.post<FormResponse>("/forms/", data);

  return response.data;
};


/**
 * Get all forms
 * GET /forms/
 */
export const getForms = async (): Promise<FormResponse[]> => {
  const response = await api.get<FormResponse[]>("/forms/");

  return response.data;
};


/**
 * Get a single form
 * GET /forms/{form_id}
 */
export const getForm = async (
  formId: number
): Promise<FormResponse> => {
  const response = await api.get<FormResponse>(
    `/forms/${formId}`
  );

  return response.data;
};


/**
 * Update a form
 * PUT /forms/{form_id}
 */
export const updateForm = async (
  formId: number,
  data: FormUpdate
): Promise<FormResponse> => {
  const response = await api.put<FormResponse>(
    `/forms/${formId}`,
    data
  );

  return response.data;
};


/**
 * Delete a form
 * DELETE /forms/{form_id}
 */
export const deleteForm = async (
  formId: number
): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(
    `/forms/${formId}`
  );

  return response.data;
};


/**
 * Update form active/inactive status
 * PATCH /forms/{form_id}/status
 */
export const updateFormStatus = async (
  formId: number,
  data: FormStatusUpdate
): Promise<{ message: string } | FormResponse> => {
  const response = await api.patch(
    `/forms/${formId}/status`,
    data
  );

  return response.data;
};


/* =========================================================
   FORM FIELD APIs
========================================================= */

/**
 * Create a form field
 * POST /forms/{form_id}/fields
 */
export const createFormField = async (
  formId: number,
  data: FormFieldCreate
): Promise<FormFieldResponse> => {
  const response = await api.post<FormFieldResponse>(
    `/forms/${formId}/fields`,
    data
  );

  return response.data;
};


/**
 * Get all fields for a form
 * GET /forms/{form_id}/fields
 */
export const getFormFields = async (
  formId: number
): Promise<FormFieldResponse[]> => {
  const response = await api.get<FormFieldResponse[]>(
    `/forms/${formId}/fields`
  );

  return response.data;
};


/**
 * Get a single form field
 * GET /forms/{form_id}/fields/{field_id}
 */
export const getFormField = async (
  formId: number,
  fieldId: number
): Promise<FormFieldResponse> => {
  const response = await api.get<FormFieldResponse>(
    `/forms/${formId}/fields/${fieldId}`
  );

  return response.data;
};


/**
 * Update a form field
 * PUT /forms/{form_id}/fields/{field_id}
 */
export const updateFormField = async (
  formId: number,
  fieldId: number,
  data: FormFieldUpdate
): Promise<FormFieldResponse> => {
  const response = await api.put<FormFieldResponse>(
    `/forms/${formId}/fields/${fieldId}`,
    data
  );

  return response.data;
};


/**
 * Delete a form field
 * DELETE /forms/{form_id}/fields/{field_id}
 */
export const deleteFormField = async (
  formId: number,
  fieldId: number
): Promise<void> => {
  await api.delete(
    `/forms/${formId}/fields/${fieldId}`
  );
};


/* =========================================================
   FIELD OPTION APIs
========================================================= */

/**
 * Create a field option
 * POST /forms/{form_id}/fields/{field_id}/options
 */
export const createFieldOption = async (
  formId: number,
  fieldId: number,
  data: FieldOptionCreate
): Promise<FieldOptionResponse> => {
  const response = await api.post<FieldOptionResponse>(
    `/forms/${formId}/fields/${fieldId}/options`,
    data
  );

  return response.data;
};


/**
 * Get all options for a field
 * GET /forms/{form_id}/fields/{field_id}/options
 */
export const getFieldOptions = async (
  formId: number,
  fieldId: number
): Promise<FieldOptionResponse[]> => {
  const response = await api.get<FieldOptionResponse[]>(
    `/forms/${formId}/fields/${fieldId}/options`
  );

  return response.data;
};


/**
 * Get a single field option
 * GET /forms/{form_id}/fields/{field_id}/options/{option_id}
 */
export const getFieldOption = async (
  formId: number,
  fieldId: number,
  optionId: number
): Promise<FieldOptionResponse> => {
  const response = await api.get<FieldOptionResponse>(
    `/forms/${formId}/fields/${fieldId}/options/${optionId}`
  );

  return response.data;
};


/**
 * Update a field option
 * PUT /forms/{form_id}/fields/{field_id}/options/{option_id}
 */
export const updateFieldOption = async (
  formId: number,
  fieldId: number,
  optionId: number,
  data: FieldOptionUpdate
): Promise<FieldOptionResponse> => {
  const response = await api.put<FieldOptionResponse>(
    `/forms/${formId}/fields/${fieldId}/options/${optionId}`,
    data
  );

  return response.data;
};


/**
 * Delete a field option
 * DELETE /forms/{form_id}/fields/{field_id}/options/{option_id}
 *
 * Backend returns 204 No Content.
 */
export const deleteFieldOption = async (
  formId: number,
  fieldId: number,
  optionId: number
): Promise<void> => {
  await api.delete(
    `/forms/${formId}/fields/${fieldId}/options/${optionId}`
  );
};


/**
 * Update field option active/inactive status
 * PATCH /forms/{form_id}/fields/{field_id}/options/{option_id}/status
 */
export const updateFieldOptionStatus = async (
  formId: number,
  fieldId: number,
  optionId: number,
  data: FieldOptionStatusUpdate
): Promise<FieldOptionResponse> => {
  const response = await api.patch<FieldOptionResponse>(
    `/forms/${formId}/fields/${fieldId}/options/${optionId}/status`,
    data
  );

  return response.data;
};