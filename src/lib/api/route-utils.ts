import type { NextRequest } from "next/server";

import { errorResponse } from "@/lib/api-response";
import type { ApiErrorCode } from "@/types/api";
import type { ApplicationStatus, JobStatus } from "@/types/db";

export const APPLICATION_STATUSES = [
  "pending",
  "accepted",
  "in_progress",
  "completed",
  "rejected",
] as const satisfies readonly ApplicationStatus[];

export const JOB_STATUSES = ["open", "closed"] as const satisfies readonly JobStatus[];

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type JsonObject = Record<string, unknown>;

export function authErrorResponse(result: {
  status: number;
  message: string;
}) {
  return errorResponse(result.status === 403 ? "FORBIDDEN" : "UNAUTHORIZED", {
    message: result.message,
    status: result.status,
  });
}

export async function parseJsonBody(request: Request) {
  try {
    const body = (await request.json()) as unknown;

    if (!isRecord(body)) {
      return {
        ok: false as const,
        response: errorResponse("BAD_REQUEST", {
          message: "Request body must be a JSON object.",
        }),
      };
    }

    return {
      ok: true as const,
      data: body,
    };
  } catch {
    return {
      ok: false as const,
      response: errorResponse("BAD_REQUEST", {
        message: "Request body must be valid JSON.",
      }),
    };
  }
}

export function parsePagination(
  searchParams: URLSearchParams,
  options?: {
    defaultLimit?: number;
    maxLimit?: number;
  },
) {
  const defaultLimit = options?.defaultLimit ?? 50;
  const maxLimit = options?.maxLimit ?? 100;
  const limit = parseBoundedInteger(searchParams.get("limit"), {
    defaultValue: defaultLimit,
    min: 1,
    max: maxLimit,
  });
  const offset = parseBoundedInteger(searchParams.get("offset"), {
    defaultValue: 0,
    min: 0,
    max: Number.MAX_SAFE_INTEGER,
  });

  return {
    limit,
    offset,
  };
}

export function parseBooleanParam(value: string | null) {
  if (!value) {
    return false;
  }

  return ["1", "true", "yes"].includes(value.toLowerCase());
}

export function getString(body: JsonObject, key: string) {
  const value = body[key];

  return typeof value === "string" ? value.trim() : null;
}

export function getOptionalString(body: JsonObject, key: string) {
  const value = body[key];

  if (value === undefined || value === null || value === "") {
    return null;
  }

  return typeof value === "string" ? value.trim() : undefined;
}

export function getNumber(body: JsonObject, key: string) {
  const value = body[key];

  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

export function getOptionalInteger(body: JsonObject, key: string) {
  const value = body[key];

  if (value === undefined || value === null || value === "") {
    return null;
  }

  const parsed = getNumber(body, key);

  return parsed === undefined || !Number.isInteger(parsed) ? undefined : parsed;
}

export function getRequiredUuid(body: JsonObject, key: string) {
  const value = getString(body, key);

  return value && isUuid(value) ? value : null;
}

export function isUuid(value: string) {
  return UUID_PATTERN.test(value);
}

export function isApplicationStatus(value: unknown): value is ApplicationStatus {
  return typeof value === "string" && APPLICATION_STATUSES.includes(value as ApplicationStatus);
}

export function isJobStatus(value: unknown): value is JobStatus {
  return typeof value === "string" && JOB_STATUSES.includes(value as JobStatus);
}

export function isDuplicateError(error: { code?: string; message?: string } | null) {
  return error?.code === "23505" || error?.message?.toLowerCase().includes("duplicate");
}

export function logRouteError(request: NextRequest | Request, error: unknown) {
  const url = "nextUrl" in request ? request.nextUrl.pathname : request.url;

  console.error(`[api] ${url}`, error);
}

export function routeError(
  code: ApiErrorCode,
  message: string,
  status?: number,
) {
  return errorResponse(code, {
    message,
    ...(status ? { status } : {}),
  });
}

function parseBoundedInteger(
  value: string | null,
  options: {
    defaultValue: number;
    min: number;
    max: number;
  },
) {
  if (!value) {
    return options.defaultValue;
  }

  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed)) {
    return options.defaultValue;
  }

  return Math.min(Math.max(parsed, options.min), options.max);
}

function isRecord(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
