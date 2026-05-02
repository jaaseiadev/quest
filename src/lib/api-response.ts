import { NextResponse } from "next/server";

import type { ApiError, ApiErrorCode, ApiSuccess } from "@/types/api";

const DEFAULT_ERROR_MESSAGES: Record<ApiErrorCode, string> = {
  BAD_REQUEST: "Invalid request.",
  UNAUTHORIZED: "Authentication required.",
  FORBIDDEN: "You do not have permission to perform this action.",
  NOT_FOUND: "Requested resource was not found.",
  CONFLICT: "Request conflicts with the current resource state.",
  INTERNAL_SERVER_ERROR: "Something went wrong.",
};

export function successResponse<T>(
  data: T,
  init?: {
    message?: string;
    status?: number;
  },
) {
  const body: ApiSuccess<T> = {
    ok: true,
    data,
    ...(init?.message ? { message: init.message } : {}),
  };

  return NextResponse.json(body, { status: init?.status ?? 200 });
}

export function errorResponse(
  code: ApiErrorCode,
  init?: {
    message?: string;
    status?: number;
  },
) {
  const body: ApiError = {
    ok: false,
    error: {
      code,
      message: init?.message ?? DEFAULT_ERROR_MESSAGES[code],
    },
  };

  return NextResponse.json(body, { status: init?.status ?? statusForError(code) });
}

export function statusForError(code: ApiErrorCode) {
  switch (code) {
    case "BAD_REQUEST":
      return 400;
    case "UNAUTHORIZED":
      return 401;
    case "FORBIDDEN":
      return 403;
    case "NOT_FOUND":
      return 404;
    case "CONFLICT":
      return 409;
    case "INTERNAL_SERVER_ERROR":
      return 500;
  }
}
