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
import { Plus, X } from "lucide-react";

import { Button, Input, Label } from "@/components/ui";
import type { PartyRank } from "@/components/party-management/types";
import type { ApiResponse } from "@/types/api";
import type { Party } from "@/types/db";

export type CreatePartyDialogProps = {
  ranks: PartyRank[];
  onCreated: (party: Party, message?: string) => void;
};

type FormState = {
  name: string;
  description: string;
  category: string;
  minRankId: string;
};

const INITIAL_FORM: FormState = {
  name: "",
  description: "",
  category: "",
  minRankId: "",
};

export function CreatePartyDialog({ ranks, onCreated }: CreatePartyDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;

    function handleClose() {
      setError(null);
      setSubmitting(false);
    }

    dialog.addEventListener("close", handleClose);

    return () => {
      dialog.removeEventListener("close", handleClose);
    };
  }, []);

  function openDialog() {
    dialogRef.current?.showModal();
    window.setTimeout(() => nameInputRef.current?.focus(), 0);
  }

  function closeDialog() {
    dialogRef.current?.close();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/parties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          description: form.description || null,
          category: form.category || null,
          min_rank_id: form.minRankId ? Number(form.minRankId) : null,
        }),
      });
      const json = (await response.json()) as ApiResponse<Party>;

      if (!json.ok) {
        throw new Error(json.error.message);
      }

      onCreated(json.data, json.message);
      setForm(INITIAL_FORM);
      closeDialog();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Party could not be created.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Button onClick={openDialog}>
        <Plus className="h-4 w-4" aria-hidden="true" />
        Create Party
      </Button>

      <dialog
        ref={dialogRef}
        className="max-h-[92dvh] w-[min(92vw,640px)] overflow-y-auto border border-border bg-surface-dim p-0 text-foreground backdrop:bg-background/80"
      >
        <form className="space-y-6 p-5 md:p-6" onSubmit={handleSubmit}>
          <div className="flex items-start justify-between gap-4 border-b border-border pb-5">
            <div>
              <p className="text-label-caps text-primary">Party Uplink</p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-foreground">
                Create Party
              </h2>
            </div>
            <Button type="button" variant="ghost" size="sm" onClick={closeDialog}>
              <X className="h-4 w-4" aria-hidden="true" />
              Close
            </Button>
          </div>

          <div className="grid gap-4">
            <Field label="Name" htmlFor="party-name">
              <Input
                ref={nameInputRef}
                id="party-name"
                value={form.name}
                required
                maxLength={80}
                placeholder="Frontend Raiders"
                onChange={(event) => setFormField("name", event.target.value, setForm)}
              />
            </Field>

            <Field label="Description" htmlFor="party-description">
              <textarea
                id="party-description"
                value={form.description}
                rows={4}
                maxLength={280}
                placeholder="Students focused on frontend quests."
                className="w-full min-w-0 border border-border bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground transition-colors duration-100 focus:border-primary focus:outline-none"
                onChange={(event) =>
                  setFormField("description", event.target.value, setForm)
                }
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Category" htmlFor="party-category">
                <Input
                  id="party-category"
                  value={form.category}
                  maxLength={60}
                  placeholder="Technology"
                  onChange={(event) =>
                    setFormField("category", event.target.value, setForm)
                  }
                />
              </Field>

              <Field label="Minimum Rank" htmlFor="party-min-rank">
                <select
                  id="party-min-rank"
                  value={form.minRankId}
                  className="h-12 w-full min-w-0 border border-border bg-input px-4 text-foreground transition-colors duration-100 focus:border-primary focus:outline-none"
                  onChange={(event) =>
                    setFormField("minRankId", event.target.value, setForm)
                  }
                >
                  <option value="">Open Rank</option>
                  {ranks.map((rank) => (
                    <option key={rank.id} value={rank.id}>
                      {rank.name}
                    </option>
                  ))}
                </select>
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
              {submitting ? "Creating" : "Create Party"}
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
