"use client";

import type { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterPillGroup } from "@/components/filter-pill-group";
import {
  EVENT_REQUEST_LINKS,
  EVENT_TYPES,
  INTERVAL_OPTIONS,
  PARTICIPANTS_OPTIONS,
  type EventRequestDetails,
} from "@/lib/event-request";

const textareaClassName =
  "w-full resize-none rounded-md border border-input bg-white px-3 py-2 text-sm shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-[var(--uzh-blue)] focus-visible:ring-2 focus-visible:ring-[var(--uzh-blue)]/20";

interface EventRequestFieldsProps {
  value: EventRequestDetails;
  onChange: (value: EventRequestDetails) => void;
}

export function EventRequestFields({ value, onChange }: EventRequestFieldsProps) {
  const set = <K extends keyof EventRequestDetails>(key: K, v: EventRequestDetails[K]) =>
    onChange({ ...value, [key]: v });

  return (
    <div className="flex flex-col gap-4 text-sm">
      <p className="text-xs leading-relaxed text-muted-foreground">
        For events that need Campus Culture&apos;s sign-off — mirrors their{" "}
        <span className="font-medium text-foreground">Room request form</span>. Leave this
        collapsed for an ordinary internal meeting.
      </p>

      <FieldGroup title="Event">
        <div>
          <FieldLabel htmlFor="er-event-type" required>
            Event type
          </FieldLabel>
          <Select value={value.eventType} onValueChange={(v) => set("eventType", v)}>
            <SelectTrigger id="er-event-type" className="w-full">
              <SelectValue placeholder="Please select an entry…" />
            </SelectTrigger>
            <SelectContent>
              {EVENT_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <FilterPillGroup
          label="Interval"
          value={value.interval}
          onChange={(v) => set("interval", v as EventRequestDetails["interval"])}
          options={INTERVAL_OPTIONS}
        />

        <div>
          <FieldLabel htmlFor="er-speakers">Speakers</FieldLabel>
          <Input
            id="er-speakers"
            value={value.speakers}
            onChange={(e) => set("speakers", e.target.value)}
            placeholder="Names of speakers, if any"
          />
        </div>
      </FieldGroup>

      <FieldGroup title="Address of organizer (or patron)">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="er-org-institute" required>
              Institute
            </FieldLabel>
            <Input
              id="er-org-institute"
              value={value.organizerInstitute}
              onChange={(e) => set("organizerInstitute", e.target.value)}
            />
          </div>
          <div>
            <FieldLabel htmlFor="er-org-street" required>
              Street, No
            </FieldLabel>
            <Input
              id="er-org-street"
              value={value.organizerStreet}
              onChange={(e) => set("organizerStreet", e.target.value)}
            />
          </div>
          <div>
            <FieldLabel htmlFor="er-org-zip" required>
              ZIP
            </FieldLabel>
            <Input
              id="er-org-zip"
              value={value.organizerZip}
              onChange={(e) => set("organizerZip", e.target.value)}
            />
          </div>
          <div>
            <FieldLabel htmlFor="er-org-city" required>
              City
            </FieldLabel>
            <Input
              id="er-org-city"
              value={value.organizerCity}
              onChange={(e) => set("organizerCity", e.target.value)}
            />
          </div>
        </div>

        <details className="group/billing">
          <summary className="cursor-pointer list-none text-xs font-medium text-[var(--uzh-blue)]">
            + Different billing address
          </summary>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="er-bill-institute">Institute</FieldLabel>
              <Input
                id="er-bill-institute"
                value={value.billingInstitute}
                onChange={(e) => set("billingInstitute", e.target.value)}
              />
            </div>
            <div>
              <FieldLabel htmlFor="er-bill-street">Street, No</FieldLabel>
              <Input
                id="er-bill-street"
                value={value.billingStreet}
                onChange={(e) => set("billingStreet", e.target.value)}
              />
            </div>
            <div>
              <FieldLabel htmlFor="er-bill-zip">ZIP</FieldLabel>
              <Input
                id="er-bill-zip"
                value={value.billingZip}
                onChange={(e) => set("billingZip", e.target.value)}
              />
            </div>
            <div>
              <FieldLabel htmlFor="er-bill-city">City</FieldLabel>
              <Input
                id="er-bill-city"
                value={value.billingCity}
                onChange={(e) => set("billingCity", e.target.value)}
              />
            </div>
          </div>
        </details>
      </FieldGroup>

      <FieldGroup title="Contact person">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="er-contact-first" required>
              First name
            </FieldLabel>
            <Input
              id="er-contact-first"
              value={value.contactFirstName}
              onChange={(e) => set("contactFirstName", e.target.value)}
            />
          </div>
          <div>
            <FieldLabel htmlFor="er-contact-name" required>
              Name
            </FieldLabel>
            <Input
              id="er-contact-name"
              value={value.contactName}
              onChange={(e) => set("contactName", e.target.value)}
            />
          </div>
          <div>
            <FieldLabel htmlFor="er-contact-email" required>
              E-mail
            </FieldLabel>
            <Input
              id="er-contact-email"
              type="email"
              value={value.contactEmail}
              onChange={(e) => set("contactEmail", e.target.value)}
            />
          </div>
          <div>
            <FieldLabel htmlFor="er-contact-phone" required>
              Phone
            </FieldLabel>
            <Input
              id="er-contact-phone"
              type="tel"
              value={value.contactPhone}
              onChange={(e) => set("contactPhone", e.target.value)}
            />
          </div>
        </div>
      </FieldGroup>

      <FieldGroup title="Participants">
        <FilterPillGroup
          label="Who is attending (excluding speakers)?"
          value={value.participants}
          onChange={(v) => set("participants", v as EventRequestDetails["participants"])}
          options={PARTICIPANTS_OPTIONS}
        />
        <YesNoRow
          label="Is the event freely accessible?"
          checked={value.freelyAccessible}
          onChange={(v) => set("freelyAccessible", v)}
        />
        <YesNoRow
          label="Do you charge a participation fee?"
          checked={value.participationFee}
          onChange={(v) => set("participationFee", v)}
        />
        <YesNoRow
          label="Any controversial or particularly high-profile speakers?"
          checked={value.controversialSpeakers}
          onChange={(v) => set("controversialSpeakers", v)}
        />
        <YesNoRow
          label="Aperitif / coffee break / food or drinks?"
          checked={value.catering}
          onChange={(v) => set("catering", v)}
        />
        <YesNoRow
          label="Event recording (podcast) and/or live streaming?"
          checked={value.recordingRequested}
          onChange={(v) => set("recordingRequested", v)}
        />
      </FieldGroup>

      <FieldGroup title="Comments">
        <textarea
          rows={3}
          value={value.comments}
          onChange={(e) => set("comments", e.target.value)}
          placeholder="Additional room bookings for the same event, room preferences, or anything else Campus Culture should know."
          className={textareaClassName}
        />
      </FieldGroup>

      <div className="flex flex-col gap-2 rounded-lg border border-dashed border-border bg-white px-3 py-3">
        <label className="flex items-start gap-2 text-xs leading-relaxed text-foreground">
          <input
            type="checkbox"
            checked={value.agreedToTerms}
            onChange={(e) => set("agreedToTerms", e.target.checked)}
            className="mt-0.5 size-3.5 shrink-0 accent-[var(--uzh-blue)]"
          />
          <span>
            I have read and agree to the{" "}
            <a
              href={EVENT_REQUEST_LINKS.codeOfConduct}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              Code of Conduct
            </a>{" "}
            and further{" "}
            <a
              href={EVENT_REQUEST_LINKS.moreInfo}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              information on submitting a request
            </a>
            . Events may only be publicized after written approval has been granted.
          </span>
        </label>
        <label className="flex items-center gap-2 text-xs text-foreground">
          <input
            type="checkbox"
            checked={value.wantsOrderConfirmation}
            onChange={(e) => set("wantsOrderConfirmation", e.target.checked)}
            className="size-3.5 shrink-0 accent-[var(--uzh-blue)]"
          />
          I would like to receive an order confirmation.
        </label>
      </div>
    </div>
  );
}

function FieldGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 border-t border-border pt-3 first:border-t-0 first:pt-0">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </p>
      {children}
    </div>
  );
}

function FieldLabel({
  htmlFor,
  required,
  children,
}: {
  htmlFor: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <Label htmlFor={htmlFor} className="mb-1.5 block text-xs font-medium text-muted-foreground">
      {children}
      {required && <span className="text-destructive">*</span>}
    </Label>
  );
}

function YesNoRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <Label className="text-xs font-normal text-foreground">{label}</Label>
      <div className="flex shrink-0 items-center gap-1.5">
        <span className="text-[11px] text-muted-foreground">{checked ? "Yes" : "No"}</span>
        <Switch checked={checked} onCheckedChange={onChange} />
      </div>
    </div>
  );
}
