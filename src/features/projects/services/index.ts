import { apiSlice } from '@/services/api-slice';
import { setProjects } from '../store/projects-slice';
import type { Project } from '../store/projects-slice';
import {
  setProjectRequirements,
  setRequirementsLoading,
  setRequirementsError,
  addRequirement,
  updateRequirement,
  removeRequirement,
} from '../store/requirements-slice';
import type { Requirement } from '../store/requirements-slice';

interface ProjectQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export const projectsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createProject: builder.mutation<Project, Record<string, unknown>>({
      query: (project) => ({
        body: project,
        method: 'POST',
        url: 'projects',
      }),
      invalidatesTags: ['projects' as never],
    }),
    getAllProjects: builder.query<Project[], ProjectQueryParams | void>({
      query: (params = { page: 1, limit: 15 }) => {
        const { page = 1, limit = 15, search, status } = params ?? {};
        let queryString = `projects?page=${page}&limit=${limit}`;
        if (search) queryString += `&search=${encodeURIComponent(search)}`;
        if (status) queryString += `&status=${encodeURIComponent(status)}`;
        return queryString;
      },
      providesTags: ['projects' as never],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setProjects(data));
        } catch (error) {
          console.error('Failed to fetch projects:', error);
        }
      },
    }),
    getProjectById: builder.query<Project, string>({
      query: (id) => `projects/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'projects' as never, id }],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setProjects([data]));
        } catch (error) {
          console.error('Failed to fetch project:', error);
        }
      },
    }),
    updateProject: builder.mutation<Project, { id: string; data: Record<string, unknown> }>({
      query: ({ id, data }) => ({
        url: `projects/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        'projects' as never,
        { type: 'projects' as never, id },
      ],
    }),
    getProjectRequirements: builder.query<Requirement[], string>({
      query: (projectId) => {
        if (!projectId) throw new Error('Project ID is required');
        return `requirements/project/${projectId}`;
      },
      transformResponse: (response: unknown): Requirement[] => {
        if (!response) return [];
        if (Array.isArray(response)) return response as Requirement[];
        const obj = response as { data?: Requirement[] };
        if (obj.data && Array.isArray(obj.data)) return obj.data;
        if (typeof response === 'object') return [response as Requirement];
        return [];
      },
      providesTags: (result, _error, projectId) => [
        { type: 'requirements' as never, id: `project-${projectId}` },
        ...(result ?? []).map((req) => ({ type: 'requirement' as never, id: req.id })),
      ],
      async onQueryStarted(projectId, { dispatch, queryFulfilled }) {
        dispatch(setRequirementsLoading({ projectId, loading: true }));
        try {
          const { data } = await queryFulfilled;
          dispatch(setProjectRequirements({ projectId, requirements: data }));
        } catch (error) {
          console.error('Failed to fetch requirements:', error);
          dispatch(
            setRequirementsError({
              projectId,
              error: error instanceof Error ? error.message : String(error),
            })
          );
        }
      },
    }),
    createProjectRequirements: builder.mutation<
      Requirement,
      { projectId: string; [key: string]: unknown }
    >({
      query: (data) => ({
        url: 'requirements',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (_result, _error, { projectId }) => [
        { type: 'requirements' as never, id: `project-${projectId}` },
      ],
      async onQueryStarted(data, { dispatch, queryFulfilled }) {
        try {
          const { data: newRequirement } = await queryFulfilled;
          dispatch(addRequirement({ projectId: String(data.projectId), requirement: newRequirement }));
        } catch (error) {
          console.error('Failed to create requirement:', error);
        }
      },
    }),
    updateProjectRequirements: builder.mutation<
      Requirement,
      { id: string; projectId: string; data: Record<string, unknown> }
    >({
      query: ({ id, data }) => ({
        url: `requirements/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id, projectId }) => [
        { type: 'requirement' as never, id },
        { type: 'requirements' as never, id: `project-${projectId}` },
      ],
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          const { data: updatedRequirement } = await queryFulfilled;
          dispatch(updateRequirement({ requirement: { ...updatedRequirement, id } }));
        } catch (error) {
          console.error('Failed to update requirement:', error);
        }
      },
    }),
    deleteProjectRequirements: builder.mutation<void, { id: string; projectId: string }>({
      query: ({ id }) => ({
        url: `requirements/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { id, projectId }) => [
        { type: 'requirement' as never, id },
        { type: 'requirements' as never, id: `project-${projectId}` },
      ],
      async onQueryStarted({ id, projectId }, { dispatch, queryFulfilled }) {
        dispatch(removeRequirement({ projectId, requirementId: id }));
        try {
          await queryFulfilled;
        } catch (error) {
          console.error('Failed to delete requirement:', error);
        }
      },
    }),
    getSingleProjectRequirement: builder.query<Requirement, string>({
      query: (id) => `requirements/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'requirement' as never, id }],
      async onQueryStarted(_id, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(updateRequirement({ requirement: data }));
        } catch (error) {
          console.error('Failed to fetch requirement:', error);
        }
      },
    }),
    uploadRequirementDocument: builder.mutation<
      Record<string, unknown>,
      { data: FormData; requirementId: string }
    >({
      query: ({ data, requirementId }) => ({
        url: `requirements/${requirementId}/documents`,
        method: 'POST',
        body: data,
        formData: true,
      }),
      invalidatesTags: (_result, _error, { requirementId }) => [
        { type: 'requirement' as never, id: requirementId },
      ],
    }),
    deleteRequirementDocument: builder.mutation<void, string>({
      query: (id) => ({
        url: `requirements/documents/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['requirements' as never],
    }),
  }),
});

export const {
  useCreateProjectMutation,
  useGetAllProjectsQuery,
  useGetProjectByIdQuery,
  useUpdateProjectMutation,
  useGetProjectRequirementsQuery,
  useCreateProjectRequirementsMutation,
  useUpdateProjectRequirementsMutation,
  useDeleteProjectRequirementsMutation,
  useGetSingleProjectRequirementQuery,
  useUploadRequirementDocumentMutation,
  useDeleteRequirementDocumentMutation,
} = projectsApi;
