"use client";

import { useCallback, useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import { CornerDownRight, Info, MessageSquare, Pin, Send, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import {
  FEEDBACK_CATEGORIES,
  FEEDBACK_MESSAGE_MAX,
  getFeedback,
  type FeedbackCategory,
  type FeedbackItem,
} from "@/lib/data/feedback";
import {
  deleteFeedbackAction,
  replyToFeedbackAction,
  submitFeedbackAction,
} from "@/actions/feedback-actions";

const CATEGORY_STYLE: Record<FeedbackCategory, string> = {
  idea: "bg-[var(--uzh-blue)]/10 text-[var(--uzh-blue)]",
  problem: "bg-[#fbe4e2] text-[#b3261e]",
  question: "bg-[var(--uzh-yellow)]/25 text-[color:oklch(0.45_0.12_80)]",
  praise: "bg-[var(--uzh-green)]/25 text-[color:oklch(0.4_0.14_128)]",
};

const textareaClassName =
  "w-full resize-none rounded-md border border-input bg-white px-3 py-2 text-sm shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-[var(--uzh-blue)] focus-visible:ring-2 focus-visible:ring-[var(--uzh-blue)]/20";

interface FeedbackDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isSuperAdmin: boolean;
  onOpenGuide: () => void;
}

export function FeedbackDrawer({ open, onOpenChange, isSuperAdmin, onOpenGuide }: FeedbackDrawerProps) {
  const [tab, setTab] = useState("share");
  const [items, setItems] = useState<FeedbackItem[] | null>(null);
  const [loadError, setLoadError] = useState(false);

  const [name, setName] = useState("");
  const [category, setCategory] = useState<FeedbackCategory>("idea");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const load = useCallback(async () => {
    try {
      setItems(await getFeedback(createClient()));
      setLoadError(false);
    } catch {
      setLoadError(true);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    getFeedback(createClient())
      .then((result) => {
        if (cancelled) return;
        setItems(result);
        setLoadError(false);
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [open]);

  const submit = async () => {
    setSending(true);
    const { error } = await submitFeedbackAction({ name, category, message });
    setSending(false);
    if (error) {
      toast.error("Couldn't send your feedback", { description: error });
      return;
    }
    toast.success("Thank you!", { description: "Your feedback is now on the wall." });
    setMessage("");
    setTab("wall");
    void load();
  };

  const remaining = FEEDBACK_MESSAGE_MAX - message.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="top-0 right-0 left-auto h-dvh max-h-dvh w-full max-w-md translate-x-0 translate-y-0 content-start gap-3 overflow-y-auto rounded-none p-5 sm:max-w-md"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <MessageSquare className="size-5 text-[var(--uzh-blue)]" />
            Feedback &amp; ideas
          </DialogTitle>
          <DialogDescription>
            Tell us what to improve, or see what others suggested. No account needed.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2.5 rounded-lg border border-[var(--uzh-blue)]/20 bg-[var(--uzh-blue)]/5 p-3 text-xs leading-relaxed text-foreground/80">
          <Info className="mt-0.5 size-4 shrink-0 text-[var(--uzh-blue)]" />
          <p>
            This is a <strong>demo</strong> built quickly with AI to show what&apos;s possible — not
            every feature is real on purpose (e.g. UZH Microsoft sign-in).{" "}
            <button
              type="button"
              onClick={() => {
                onOpenChange(false);
                onOpenGuide();
              }}
              className="font-medium text-[var(--uzh-blue)] underline underline-offset-2"
            >
              See what works and what doesn&apos;t
            </button>
            .
          </p>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="w-full">
            <TabsTrigger value="share" className="flex-1">
              Leave feedback
            </TabsTrigger>
            <TabsTrigger value="wall" className="flex-1">
              Feedback wall{items ? ` (${items.length})` : ""}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="share" className="mt-3 flex flex-col gap-4">
            <div>
              <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                What kind of feedback?
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {FEEDBACK_CATEGORIES.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setCategory(c.value)}
                    className={cn(
                      "rounded-lg border px-3 py-2 text-left transition-colors",
                      category === c.value
                        ? "border-[var(--uzh-blue)] bg-[var(--uzh-blue)]/5"
                        : "border-input bg-white hover:border-[var(--uzh-blue)]/40",
                    )}
                  >
                    <span className="block text-sm font-semibold text-foreground">{c.label}</span>
                    <span className="block text-[11px] text-muted-foreground">{c.hint}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="fb-message" className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Your feedback
              </Label>
              <textarea
                id="fb-message"
                rows={6}
                maxLength={FEEDBACK_MESSAGE_MAX}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What would make this better for you?"
                className={textareaClassName}
              />
              <p className="mt-1 text-right text-[11px] text-muted-foreground">
                {remaining} characters left
              </p>
            </div>

            <div>
              <Label htmlFor="fb-name" className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Your name (optional)
              </Label>
              <Input
                id="fb-name"
                maxLength={60}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Leave blank to stay anonymous"
              />
              <p className="mt-1 text-[11px] text-muted-foreground">
                Feedback is public on the wall. Please don&apos;t include personal or confidential
                information.
              </p>
            </div>

            <Button
              className="w-full gap-1.5 bg-[var(--uzh-blue)] hover:bg-[var(--uzh-blue)]/90"
              disabled={sending || message.trim().length < 3}
              onClick={() => void submit()}
            >
              <Send className="size-4" />
              {sending ? "Sending…" : "Send feedback"}
            </Button>
          </TabsContent>

          <TabsContent value="wall" className="mt-3 flex flex-col gap-3">
            {loadError ? (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
                Couldn&apos;t load the wall right now — please try again in a moment.
              </p>
            ) : items === null ? (
              <p className="py-6 text-center text-sm text-muted-foreground">Loading…</p>
            ) : items.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Nothing here yet — be the first to leave feedback.
              </p>
            ) : (
              items.map((item) => (
                <FeedbackCard key={item.id} item={item} isSuperAdmin={isSuperAdmin} onChanged={load} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function FeedbackCard({
  item,
  isSuperAdmin,
  onChanged,
}: {
  item: FeedbackItem;
  isSuperAdmin: boolean;
  onChanged: () => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(item.reply ?? "");
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const category = FEEDBACK_CATEGORIES.find((c) => c.value === item.category);

  const saveReply = async () => {
    setBusy(true);
    const { error } = await replyToFeedbackAction({ id: item.id, reply: draft });
    setBusy(false);
    if (error) {
      toast.error("Couldn't save the reply", { description: error });
      return;
    }
    setEditing(false);
    toast.success(draft.trim() ? "Reply published" : "Reply removed");
    await onChanged();
  };

  const remove = async () => {
    setBusy(true);
    const { error } = await deleteFeedbackAction(item.id);
    setBusy(false);
    if (error) {
      toast.error("Couldn't delete that", { description: error });
      return;
    }
    await onChanged();
  };

  return (
    <article className="rounded-xl border border-border bg-white p-3.5">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[11px] font-semibold",
            CATEGORY_STYLE[item.category],
          )}
        >
          {category?.label}
        </span>
        {item.pinned && (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
            <Pin className="size-3" />
            Pinned
          </span>
        )}
        <span className="ml-auto text-[11px] text-muted-foreground">
          {item.authorName || "Anonymous"} · {format(parseISO(item.createdAt), "d MMM yyyy")}
        </span>
      </div>
      <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-foreground">{item.message}</p>

      {item.reply && !editing && (
        <div className="mt-3 flex gap-2 rounded-lg border-l-2 border-[var(--uzh-blue)] bg-[var(--uzh-blue)]/5 p-3">
          <CornerDownRight className="mt-0.5 size-4 shrink-0 text-[var(--uzh-blue)]" />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--uzh-blue)]">
              Reply from the team
              {item.repliedAt ? ` · ${format(parseISO(item.repliedAt), "d MMM yyyy")}` : ""}
            </p>
            <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-foreground/90">
              {item.reply}
            </p>
          </div>
        </div>
      )}

      {isSuperAdmin && (
        <div className="mt-3 border-t border-dashed border-border pt-3">
          {editing ? (
            <div className="flex flex-col gap-2">
              <textarea
                rows={4}
                maxLength={2000}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Write a public reply…"
                className={textareaClassName}
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  disabled={busy}
                  className="bg-[var(--uzh-blue)] hover:bg-[var(--uzh-blue)]/90"
                  onClick={() => void saveReply()}
                >
                  {busy ? "Saving…" : "Publish reply"}
                </Button>
                <Button size="sm" variant="ghost" disabled={busy} onClick={() => setEditing(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
                {item.reply ? "Edit reply" : "Reply"}
              </Button>
              {confirmDelete ? (
                <>
                  <Button size="sm" variant="destructive" disabled={busy} onClick={() => void remove()}>
                    Delete for everyone
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setConfirmDelete(false)}>
                    Keep
                  </Button>
                </>
              ) : (
                <Button
                  size="icon-sm"
                  variant="ghost"
                  aria-label="Delete feedback"
                  onClick={() => setConfirmDelete(true)}
                >
                  <Trash2 className="size-4" />
                </Button>
              )}
              <span className="ml-auto text-[11px] text-muted-foreground">Super admin</span>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
