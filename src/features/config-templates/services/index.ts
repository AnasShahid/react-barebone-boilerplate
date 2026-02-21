import { apiSlice } from '@/services/api-slice';
import { setServiceRoles } from '../store/service-roles-slice';
import { setConfigTemplates } from '../store/config-templates-slice';
import type { ConfigTemplate } from '../store/config-templates-slice';
import type { ServiceRole } from '../store/service-roles-slice';

interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export const configTemplatesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createConfigTemplate: builder.mutation<ConfigTemplate, Record<string, unknown>>({
      query: (configTemplate) => ({
        body: configTemplate,
        method: 'POST',
        url: 'config-templates',
      }),
      invalidatesTags: ['config-templates'],
    }),
    updateConfigTemplate: builder.mutation<
      ConfigTemplate,
      { id: string; [key: string]: unknown }
    >({
      query: ({ id, ...configTemplate }) => ({
        body: configTemplate,
        method: 'PATCH',
        url: `config-templates/${id}`,
      }),
      invalidatesTags: ['config-templates'],
    }),
    getAllConfigTemplates: builder.query<
      { configTemplates?: ConfigTemplate[] },
      QueryParams | void
    >({
      query: (params = { page: 1, limit: 15 }) => {
        const { page = 1, limit = 15, search, status } = params ?? {};
        let queryString = `config-templates?page=${page}&limit=${limit}`;
        if (search) queryString += `&search=${encodeURIComponent(search)}`;
        if (status) queryString += `&status=${encodeURIComponent(status)}`;
        return queryString;
      },
      providesTags: ['config-templates'],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setConfigTemplates(data));
        } catch (error) {
          console.error('Failed to fetch config templates:', error);
        }
      },
    }),
    getConfigTemplateById: builder.query<ConfigTemplate, string>({
      query: (id) => `config-templates/${id}`,
    }),
    deleteConfigTemplate: builder.mutation<void, string>({
      query: (id) => ({
        method: 'DELETE',
        url: `config-templates/${id}`,
      }),
      invalidatesTags: ['config-templates'],
    }),
    createServiceRole: builder.mutation<ServiceRole, Record<string, unknown>>({
      query: (serviceRole) => ({
        body: serviceRole,
        method: 'POST',
        url: 'service-roles',
      }),
      invalidatesTags: ['service-roles' as never],
    }),
    getAllServiceRoles: builder.query<ServiceRole[], void>({
      query: () => 'service-roles',
      providesTags: ['service-roles' as never],
      transformResponse: (response: unknown): ServiceRole[] => {
        if (!response) return [];
        const raw = response as { serviceRoles?: ServiceRole[]; data?: ServiceRole[] } | ServiceRole[];
        const serviceRoles = Array.isArray(raw)
          ? raw
          : (raw as { serviceRoles?: ServiceRole[]; data?: ServiceRole[] }).serviceRoles ??
            (raw as { data?: ServiceRole[] }).data ??
            [];
        return Array.isArray(serviceRoles) ? serviceRoles : [];
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setServiceRoles({ serviceRoles: data }));
        } catch (error) {
          console.error('Failed to fetch service roles:', error);
        }
      },
    }),
    getServiceRoleById: builder.query<ServiceRole, string>({
      query: (id) => `service-roles/${id}`,
    }),
    updateServiceRole: builder.mutation<ServiceRole, { id: string; [key: string]: unknown }>({
      query: ({ id, ...serviceRole }) => ({
        body: serviceRole,
        method: 'PUT',
        url: `service-roles/${id}`,
      }),
      invalidatesTags: ['service-roles' as never],
    }),
    deleteServiceRole: builder.mutation<void, string>({
      query: (id) => ({
        method: 'DELETE',
        url: `service-roles/${id}`,
      }),
      invalidatesTags: ['service-roles' as never],
    }),
  }),
});

export const {
  useCreateConfigTemplateMutation,
  useUpdateConfigTemplateMutation,
  useGetAllConfigTemplatesQuery,
  useGetConfigTemplateByIdQuery,
  useDeleteConfigTemplateMutation,
  useCreateServiceRoleMutation,
  useGetAllServiceRolesQuery,
  useGetServiceRoleByIdQuery,
  useUpdateServiceRoleMutation,
  useDeleteServiceRoleMutation,
} = configTemplatesApi;
