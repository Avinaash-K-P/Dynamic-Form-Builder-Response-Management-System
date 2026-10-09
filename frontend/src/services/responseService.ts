import api from "./api";

// Types
export interface FormResponse {
id: number;
form_id: number;
submitted_by: number;
status: string;
submitted_at: string;
}

export interface FormResponseCreate {
form_id: number;
}

export interface FormResponseUpdate {
status?: string | null;
}

// Create a response
export const createFormResponse = async (
payload: FormResponseCreate
): Promise<FormResponse> => {
const response = await api.post<FormResponse>("/responses/", payload);
return response.data;
};

// Get all responses for the current user
export const getFormResponses = async (): Promise<FormResponse[]> => {
const response = await api.get<FormResponse[]>("/responses/");
return response.data;
};

// Get a response by ID
export const getFormResponse = async (
responseId: number
): Promise<FormResponse> => {
const response = await api.get<FormResponse>(
`/responses/${responseId}`
);
return response.data;
};

// Update a response
export const updateFormResponse = async (
responseId: number,
payload: FormResponseUpdate
): Promise<FormResponse> => {
const response = await api.put<FormResponse>(
`/responses/${responseId}`,
payload
);
return response.data;
};

// Delete a response (admin only)
export const deleteFormResponse = async (
responseId: number
): Promise<{ message: string }> => {
const response = await api.delete<{ message: string }>(
`/responses/${responseId}`
);
return response.data;
};

// Response Detail Types
export interface ResponseDetail {
id: number;
response_id: number;
field_id: number;
response_value: unknown | null;
created_at: string;
updated_at: string;
}

export interface ResponseDetailCreate {
field_id: number;
response_value?: unknown | null;
}

export interface ResponseDetailUpdate {
response_value?: unknown | null;
}

export interface ResponseDetailListResponse {
items: ResponseDetail[];
total: number;
page: number;
limit: number;
total_pages: number;
}

// Create a response detail
export const createResponseDetail = async (
responseId: number,
payload: ResponseDetailCreate
): Promise<ResponseDetail> => {
const response = await api.post<ResponseDetail>(
`/responses/${responseId}/details`,
{
...payload,
response_id: responseId,
}
);

return response.data;
};

// Get all details for a response
export const getResponseDetails = async (
responseId: number,
params?: {
page?: number;
limit?: number;
search?: string;
field_id?: number;
}
): Promise<ResponseDetailListResponse> => {
const response = await api.get<ResponseDetailListResponse>(
`/responses/${responseId}/details`,
{ params }
);

return response.data;
};

// Get a response detail by ID
export const getResponseDetail = async (
responseId: number,
detailId: number
): Promise<ResponseDetail> => {
const response = await api.get<ResponseDetail>(
`/responses/${responseId}/details/${detailId}`
);

return response.data;
};

// Update a response detail
export const updateResponseDetail = async (
responseId: number,
detailId: number,
payload: ResponseDetailUpdate
): Promise<ResponseDetail> => {
const response = await api.put<ResponseDetail>(
`/responses/${responseId}/details/${detailId}`,
payload
);

return response.data;
};

// Delete a response detail (admin only)
export const deleteResponseDetail = async (
responseId: number,
detailId: number
): Promise<{ message: string }> => {
const response = await api.delete<{ message: string }>(
`/responses/${responseId}/details/${detailId}`
);

return response.data;
};
