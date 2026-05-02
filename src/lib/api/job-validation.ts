import { errorResponse } from "@/lib/api-response";
import {
  getNumber,
  getOptionalInteger,
  getOptionalString,
  getString,
  isJobStatus,
} from "@/lib/api/route-utils";
import type { JobInsert, JobUpdate } from "@/types/db";

type ValidationResult<T> =
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      response: Response;
    };

type JobPayload = Record<string, unknown>;

const TEXT_FIELDS = ["description", "category", "company", "location"] as const;

export function validateCreateJobPayload(
  body: JobPayload,
  createdBy: string,
): ValidationResult<JobInsert> {
  const title = getString(body, "title");

  if (!title) {
    return invalid("Job title is required.");
  }

  const common = validateCommonJobFields(body, false);

  if (!common.ok) {
    return common;
  }

  return {
    ok: true,
    data: {
      title,
      description: common.data.description ?? null,
      category: common.data.category ?? null,
      company: common.data.company ?? null,
      pay: common.data.pay ?? null,
      location: common.data.location ?? null,
      slots: common.data.slots ?? 1,
      reward_xp: common.data.reward_xp ?? 50,
      status: common.data.status ?? "open",
      deadline: common.data.deadline ?? null,
      recommended_rank_id: common.data.recommended_rank_id ?? null,
      created_by: createdBy,
    },
  };
}

export function validateUpdateJobPayload(
  body: JobPayload,
): ValidationResult<JobUpdate> {
  const update: JobUpdate = {};

  if (hasField(body, "title")) {
    const title = getString(body, "title");

    if (!title) {
      return invalid("Job title must be a non-empty string.");
    }

    update.title = title;
  }

  const common = validateCommonJobFields(body, true);

  if (!common.ok) {
    return common;
  }

  return {
    ok: true,
    data: {
      ...update,
      ...common.data,
    },
  };
}

function validateCommonJobFields(
  body: JobPayload,
  partial: boolean,
): ValidationResult<JobUpdate> {
  const data: JobUpdate = {};

  for (const field of TEXT_FIELDS) {
    if (!partial || hasField(body, field)) {
      const value = getOptionalString(body, field);

      if (value === undefined) {
        return invalid(`${field} must be a string.`);
      }

      data[field] = value;
    }
  }

  if (!partial || hasField(body, "pay")) {
    const value = body.pay;

    if (value === undefined || value === null || value === "") {
      data.pay = null;
    } else {
      const pay = getNumber(body, "pay");

      if (pay === undefined || pay < 0) {
        return invalid("Pay must be a non-negative number.");
      }

      data.pay = pay;
    }
  }

  if (!partial || hasField(body, "slots")) {
    const slots = getOptionalInteger(body, "slots");

    if (slots === undefined || slots === null || slots < 0) {
      return invalid("Slots must be a non-negative integer.");
    }

    data.slots = slots;
  }

  if (!partial || hasField(body, "reward_xp")) {
    const rewardXp = getOptionalInteger(body, "reward_xp");

    if (rewardXp === undefined || rewardXp === null || rewardXp < 0) {
      return invalid("Reward XP must be a non-negative integer.");
    }

    data.reward_xp = rewardXp;
  }

  if (!partial || hasField(body, "status")) {
    if (!isJobStatus(body.status)) {
      return invalid("Status must be open or closed.");
    }

    data.status = body.status;
  }

  if (!partial || hasField(body, "deadline")) {
    const deadline = parseDeadline(body.deadline);

    if (deadline === undefined) {
      return invalid("Deadline must be a valid ISO date string or null.");
    }

    data.deadline = deadline;
  }

  if (!partial || hasField(body, "recommended_rank_id")) {
    const rankId = getOptionalInteger(body, "recommended_rank_id");

    if (rankId === undefined || (rankId !== null && rankId < 1)) {
      return invalid("Recommended rank must be a valid rank id or null.");
    }

    data.recommended_rank_id = rankId;
  }

  return {
    ok: true,
    data,
  };
}

function parseDeadline(value: unknown) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  if (typeof value !== "string") {
    return undefined;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return date.toISOString();
}

function hasField(body: JobPayload, key: string) {
  return Object.prototype.hasOwnProperty.call(body, key);
}

function invalid(message: string): ValidationResult<never> {
  return {
    ok: false,
    response: errorResponse("BAD_REQUEST", {
      message,
    }),
  };
}
