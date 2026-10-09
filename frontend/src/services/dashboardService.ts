import api from "./api";

/* ================================
   Dashboard Analytics Types
================================ */

export interface FormResponseSummary {
  form_id: number;
  form_title: string;
  response_count: number;
}

export interface DashboardAnalyticsResponse {
  total_forms: number;
  active_forms: number;
  inactive_forms: number;
  total_responses: number;
  today_responses: number;
  total_users: number;
  active_users: number;

  responses_by_form: FormResponseSummary[];
}

/* ================================
   Field Analytics Types
================================ */

export interface OptionAnalytics {
  option_label: string;
  option_value: string;
  response_count: number;
}

export interface FieldAnalyticsResponse {
  field_id: number;
  label: string;
  field_type: string;
  total_answers: number;

  options?: OptionAnalytics[];
}

/* ================================
   Form-wise Analytics Types
================================ */

export interface FormAnalyticsResponse {
  form_id: number;
  title: string;
  is_active: boolean;

  total_responses: number;
  today_responses: number;

  fields: FieldAnalyticsResponse[];
}

/* ================================
   Dashboard Analytics API
================================ */

/**
 * Fetch dashboard analytics summary.
 */
export const getDashboardAnalytics =
  async (): Promise<DashboardAnalyticsResponse> => {
    const response =
      await api.get<DashboardAnalyticsResponse>(
        "/analytics/dashboard"
      );

    return response.data;
  };

/* ================================
   Form-wise Analytics API
================================ */

/**
 * Fetch analytics for a specific form.
 */
export const getFormAnalytics = async (
  formId: number
): Promise<FormAnalyticsResponse> => {
  const response =
    await api.get<FormAnalyticsResponse>(
      `/analytics/form-wise/${formId}`
    );

  return response.data;
};

