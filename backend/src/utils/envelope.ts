import type { FastifyRequest } from "fastify";

export type ApiMeta = {
  requestId: string;
  apiVersion: "v1";
};

export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "RATE_LIMITED"
  | "RECHECK_ALREADY_RUNNING"
  | "LLM_PROVIDER_TIMEOUT"
  | "INTERNAL_ERROR";

export type ApiErrorDetail = {
  field?: string;
  message: string;
};

export const metaFor = (request: FastifyRequest): ApiMeta => ({
  requestId: request.id,
  apiVersion: "v1"
});

export const successEnvelope = <T>(request: FastifyRequest, data: T) => ({
  data,
  meta: metaFor(request)
});

export const errorEnvelope = (
  request: FastifyRequest,
  code: ApiErrorCode,
  message: string,
  details?: ApiErrorDetail[]
) => ({
  error: {
    code,
    message,
    ...(details && details.length > 0 ? { details } : {})
  },
  meta: metaFor(request)
});
