"use client";

import {
  type Dispatch,
  type FormEvent,
  type ReactNode,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { Plus, Save, X } from "lucide-react";

import type { AdminJob, AdminRank } from "@/components/admin/types";
import { Button, Input, Label } from "@/components/ui";
import type { ApiResponse } from "@/types/api";

type JobFormProps = {
  ranks: AdminRank[];
  editingJob: AdminJob | null;
  onSaved: (job: AdminJob, message?: string) => void;
  onCancelEdit: () => void;
};

type FormState = {
  title: string;
  description: string;
  category: string;
  company: string;
  pay: string;
  location: string;
  slots: string;
  rewardXp: string;
  status: "open" | "closed";
  deadline: string;
  recommendedRankId: string;
};

const INITIAL_FORM: FormState = {
  title: "",
  description: "",
  category: "",
  company: "",
  pay: "",
  location: "",
  slots: "1",
  rewardXp: "50",
  status: "open",
  deadline: "",
  recommendedRankId: "",
};

export function JobForm({
  ranks,
  editingJob,
  onSaved,
  onCancelEdit,
}: JobFormProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState(() =>
    editingJob ? jobToForm(editingJob) : INITIAL_FORM,
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!editingJob) return;

    dialogRef.current?.showModal();
    window.setTimeout(() => titleInputRef.current?.focus(), 0);
  }, [editingJob]);

  function openCreateDialog() {
    setForm(INITIAL_FORM);
    setError(null);
    dialogRef.current?.showModal();
    window.setTimeout(() => titleInputRef.current?.focus(), 0);
  }

  function closeDialog() {
    dialogRef.current?.close();
    setSubmitting(false);
    setError(null);
    onCancelEdit();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(
        editingJob ? `/api/admin/jobs/${editingJob.id}` : "/api/admin/jobs",
        {
          method: editingJob ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formToPayload(form)),
        },
      );
      const json = (await response.json()) as ApiResponse<AdminJob>;

      if (!json.ok) {
        throw new Error(json.error.message);
      }

      onSaved(json.data, json.message);
      closeDialog();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Job could not be saved.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Button onClick={openCreateDialog}>
        <Plus className="h-4 w-4" aria-hidden="true" />
        New Quest
      </Button>

      <dialog
        ref={dialogRef}
        className="max-h-[92dvh] w-[min(94vw,860px)] overflow-y-auto border border-border bg-surface-dim p-0 text-foreground backdrop:bg-background/80"
      >
        <form className="space-y-6 p-5 md:p-6" onSubmit={handleSubmit}>
          <div className="flex items-start justify-between gap-4 border-b border-border pb-5">
            <div>
              <p className="text-label-caps text-primary">Job Control</p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-foreground">
                {editingJob ? "Edit Quest" : "Create Quest"}
              </h2>
            </div>
            <Button type="button" variant="ghost" size="sm" onClick={closeDialog}>
              <X className="h-4 w-4" aria-hidden="true" />
              Close
            </Button>
          </div>

          <div className="grid gap-4">
            <Field label="Title" htmlFor="job-title">
              <Input
                ref={titleInputRef}
                id="job-title"
                value={form.title}
                required
                maxLength={120}
                placeholder="Frontend Intern"
                onChange={(event) => setFormField("title", event.target.value, setForm)}
              />
            </Field>

            <Field label="Description" htmlFor="job-description">
              <textarea
                id="job-description"
                value={form.description}
                rows={5}
                placeholder="Build UI components for internal dashboard."
                className="w-full min-w-0 border border-border bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground transition-colors duration-100 focus:border-primary focus:outline-none"
                onChange={(event) =>
                  setFormField("description", event.target.value, setForm)
                }
              />
            </Field>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Category" htmlFor="job-category">
                <Input
                  id="job-category"
                  value={form.category}
                  placeholder="Technology"
                  onChange={(event) =>
                    setFormField("category", event.target.value, setForm)
                  }
                />
              </Field>
              <Field label="Company" htmlFor="job-company">
                <Input
                  id="job-company"
                  value={form.company}
                  placeholder="Apex Labs"
                  onChange={(event) =>
                    setFormField("company", event.target.value, setForm)
                  }
                />
              </Field>
              <Field label="Pay" htmlFor="job-pay">
                <Input
                  id="job-pay"
                  type="number"
                  min="0"
                  value={form.pay}
                  placeholder="5000"
                  onChange={(event) => setFormField("pay", event.target.value, setForm)}
                />
              </Field>
              <Field label="Location" htmlFor="job-location">
                <Input
                  id="job-location"
                  value={form.location}
                  placeholder="Remote"
                  onChange={(event) =>
                    setFormField("location", event.target.value, setForm)
                  }
                />
              </Field>
              <Field label="Slots" htmlFor="job-slots">
                <Input
                  id="job-slots"
                  type="number"
                  min="0"
                  value={form.slots}
                  required
                  onChange={(event) => setFormField("slots", event.target.value, setForm)}
                />
              </Field>
              <Field label="Reward XP" htmlFor="job-reward-xp">
                <Input
                  id="job-reward-xp"
                  type="number"
                  min="0"
                  value={form.rewardXp}
                  required
                  onChange={(event) =>
                    setFormField("rewardXp", event.target.value, setForm)
                  }
                />
              </Field>
              <Field label="Status" htmlFor="job-status">
                <select
                  id="job-status"
                  value={form.status}
                  className="h-12 w-full min-w-0 border border-border bg-input px-4 text-foreground transition-colors duration-100 focus:border-primary focus:outline-none"
                  onChange={(event) =>
                    setFormField("status", event.target.value as FormState["status"], setForm)
                  }
                >
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </Field>
              <Field label="Recommended Rank" htmlFor="job-rank">
                <select
                  id="job-rank"
                  value={form.recommendedRankId}
                  className="h-12 w-full min-w-0 border border-border bg-input px-4 text-foreground transition-colors duration-100 focus:border-primary focus:outline-none"
                  onChange={(event) =>
                    setFormField("recommendedRankId", event.target.value, setForm)
                  }
                >
                  <option value="">No rank gate</option>
                  {ranks.map((rank) => (
                    <option key={rank.id} value={rank.id}>
                      {rank.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Deadline" htmlFor="job-deadline">
                <Input
                  id="job-deadline"
                  type="datetime-local"
                  value={form.deadline}
                  onChange={(event) =>
                    setFormField("deadline", event.target.value, setForm)
                  }
                />
              </Field>
            </div>
          </div>

          {error ? (
            <div className="border border-danger bg-danger/10 p-3 text-sm text-danger">
              {error}
            </div>
          ) : null}

          <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
            <Button type="button" variant="secondary" onClick={closeDialog}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              <Save className="h-4 w-4" aria-hidden="true" />
              {submitting ? "Saving" : editingJob ? "Save Changes" : "Create Job"}
            </Button>
          </div>
        </form>
      </dialog>
    </>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}

function setFormField(
  key: keyof FormState,
  value: string,
  setForm: Dispatch<SetStateAction<FormState>>,
) {
  setForm((current) => ({
    ...current,
    [key]: value,
  }));
}

function formToPayload(form: FormState) {
  return {
    title: form.title,
    description: form.description || null,
    category: form.category || null,
    company: form.company || null,
    pay: form.pay ? Number(form.pay) : null,
    location: form.location || null,
    slots: Number(form.slots),
    reward_xp: Number(form.rewardXp),
    status: form.status,
    deadline: form.deadline ? new Date(form.deadline).toISOString() : null,
    recommended_rank_id: form.recommendedRankId
      ? Number(form.recommendedRankId)
      : null,
  };
}

function jobToForm(job: AdminJob): FormState {
  return {
    title: job.title,
    description: job.description ?? "",
    category: job.category ?? "",
    company: job.company ?? "",
    pay: job.pay === null ? "" : String(job.pay),
    location: job.location ?? "",
    slots: String(job.slots),
    rewardXp: String(job.reward_xp),
    status: job.status,
    deadline: job.deadline ? toDatetimeLocalValue(job.deadline) : "",
    recommendedRankId: job.recommended_rank_id ? String(job.recommended_rank_id) : "",
  };
}

function toDatetimeLocalValue(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

  return offsetDate.toISOString().slice(0, 16);
}
