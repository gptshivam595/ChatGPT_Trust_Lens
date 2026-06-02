import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { errorEnvelope, type ApiErrorCode, type ApiErrorDetail } from "./envelope.js";

export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly statusCode: number;
  readonly details?: ApiErrorDetail[];

  constructor(
    code: ApiErrorCode,
    message: string,
    statusCode: number,
    details?: ApiErrorDetail[]
  ) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

const getValidationDetails = (error: FastifyError): ApiErrorDetail[] => {
  const validation = error.validation ?? [];
  return validation.map((entry) => ({
    field: entry.instancePath || entry.schemaPath,
    message: entry.message ?? "Invalid value."
  }));
};

export const handleError = (
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  if (error.validation) {
    return reply.status(400).send(
      errorEnvelope(
        request,
        "VALIDATION_ERROR",
        "The request body is invalid.",
        getValidationDetails(error)
      )
    );
  }

  if (error.statusCode === 413) {
    return reply
      .status(413)
      .send(errorEnvelope(request, "VALIDATION_ERROR", "The request body is too large."));
  }

  if (error.statusCode === 429) {
    return reply
      .status(429)
      .send(errorEnvelope(request, "RATE_LIMITED", "Too many requests."));
  }

  if (error instanceof ApiError) {
    return reply
      .status(error.statusCode)
      .send(errorEnvelope(request, error.code, error.message, error.details));
  }

  request.log.error({ error }, "Unhandled backend error");

  return reply
    .status(500)
    .send(errorEnvelope(request, "INTERNAL_ERROR", "Unexpected server error."));
};
