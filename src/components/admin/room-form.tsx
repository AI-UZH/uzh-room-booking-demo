"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
import { createRoomAction, updateRoomAction, type RoomFormInput } from "@/actions/room-actions";
import type { BuildingOption } from "@/lib/data/rooms";
import type { RoomType, Room } from "@/lib/rooms";

interface RoomFormProps {
  buildings: BuildingOption[];
  roomTypes: RoomType[];
  roomTypeIdBySlug: Record<string, string>;
  existing?: Room;
  onSaved: () => void;
  onCancel: () => void;
}

const emptyState = {
  code: "",
  name: "",
  shortCode: "",
  buildingId: "",
  roomTypeSlug: "",
  capacity: "",
  description: "",
  imageUrl: "",
  imageAlt: "",
  requiresApproval: false,
  wheelchairAccessible: true,
  hearingLoop: false,
  hasProjector: true,
  hasWhiteboard: true,
  hasVideoConferencing: false,
  hasNaturalLight: true,
  features: "",
};

export function RoomForm({
  buildings,
  roomTypes,
  roomTypeIdBySlug,
  existing,
  onSaved,
  onCancel,
}: RoomFormProps) {
  const [form, setForm] = useState(() =>
    existing
      ? {
          code: existing.code,
          name: existing.name,
          shortCode: existing.shortCode,
          buildingId: existing.buildingId,
          roomTypeSlug: existing.roomType?.slug ?? "",
          capacity: String(existing.capacity),
          description: existing.description,
          imageUrl: existing.image,
          imageAlt: existing.imageAlt,
          requiresApproval: existing.requiresApproval,
          wheelchairAccessible: existing.accessibility.wheelchairAccessible,
          hearingLoop: existing.accessibility.hearingLoop,
          hasProjector: existing.amenities.projector,
          hasWhiteboard: existing.amenities.whiteboard,
          hasVideoConferencing: existing.amenities.videoConferencing,
          hasNaturalLight: existing.amenities.naturalLight,
          features: existing.features.join(", "),
        }
      : emptyState,
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);

    const input: Partial<RoomFormInput> = {
      code: form.code.trim(),
      name: form.name.trim(),
      short_code: form.shortCode.trim() || form.code.trim(),
      building_id: form.buildingId,
      room_type_id: form.roomTypeSlug ? roomTypeIdBySlug[form.roomTypeSlug] ?? null : null,
      capacity: Number(form.capacity) || 1,
      description: form.description.trim(),
      image_url: form.imageUrl.trim(),
      image_alt: form.imageAlt.trim() || form.name.trim(),
      requires_approval: form.requiresApproval,
      wheelchair_accessible: form.wheelchairAccessible,
      hearing_loop: form.hearingLoop,
      has_projector: form.hasProjector,
      has_whiteboard: form.hasWhiteboard,
      has_video_conferencing: form.hasVideoConferencing,
      has_natural_light: form.hasNaturalLight,
      features: form.features
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean),
    };

    const result = existing
      ? await updateRoomAction(existing.id, input)
      : await createRoomAction(input as RoomFormInput);

    setSaving(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    toast.success(existing ? "Room updated" : "Room created");
    onSaved();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Code (slug)">
          <Input value={form.code} onChange={(e) => set("code", e.target.value)} placeholder="hah-e-03" />
        </Field>
        <Field label="Short code">
          <Input
            value={form.shortCode}
            onChange={(e) => set("shortCode", e.target.value)}
            placeholder="HAH-E-03"
          />
        </Field>
      </div>

      <Field label="Name">
        <Input
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="HAH-E-03 Hörsaal"
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Building">
          <Select value={form.buildingId} onValueChange={(v) => set("buildingId", v)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a building" />
            </SelectTrigger>
            <SelectContent>
              {buildings.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  {b.code} — {b.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Room type">
          <Select value={form.roomTypeSlug} onValueChange={(v) => set("roomTypeSlug", v)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a type" />
            </SelectTrigger>
            <SelectContent>
              {roomTypes.map((rt) => (
                <SelectItem key={rt.slug} value={rt.slug}>
                  {rt.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Field label="Capacity">
        <Input
          type="number"
          min={1}
          value={form.capacity}
          onChange={(e) => set("capacity", e.target.value)}
        />
      </Field>

      <Field label="Description">
        <textarea
          rows={3}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          className="w-full resize-none rounded-md border border-input bg-white px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-[var(--uzh-blue)] focus-visible:ring-2 focus-visible:ring-[var(--uzh-blue)]/20"
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Image URL">
          <Input value={form.imageUrl} onChange={(e) => set("imageUrl", e.target.value)} placeholder="/images/rooms/…/1.jpg" />
        </Field>
        <Field label="Image alt text">
          <Input value={form.imageAlt} onChange={(e) => set("imageAlt", e.target.value)} />
        </Field>
      </div>

      <Field label="Features (comma-separated)">
        <Input
          value={form.features}
          onChange={(e) => set("features", e.target.value)}
          placeholder="Tiered seating, Lecture capture"
        />
      </Field>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2 rounded-md border border-border p-3">
        <ToggleField
          label="Needs approval"
          checked={form.requiresApproval}
          onChange={(v) => set("requiresApproval", v)}
        />
        <ToggleField
          label="Wheelchair accessible"
          checked={form.wheelchairAccessible}
          onChange={(v) => set("wheelchairAccessible", v)}
        />
        <ToggleField label="Hearing loop" checked={form.hearingLoop} onChange={(v) => set("hearingLoop", v)} />
        <ToggleField label="Projector" checked={form.hasProjector} onChange={(v) => set("hasProjector", v)} />
        <ToggleField label="Whiteboard" checked={form.hasWhiteboard} onChange={(v) => set("hasWhiteboard", v)} />
        <ToggleField
          label="Video conferencing"
          checked={form.hasVideoConferencing}
          onChange={(v) => set("hasVideoConferencing", v)}
        />
        <ToggleField
          label="Natural light"
          checked={form.hasNaturalLight}
          onChange={(v) => set("hasNaturalLight", v)}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
        <Button
          className="bg-[var(--uzh-blue)] hover:bg-[var(--uzh-blue)]/90"
          onClick={() => void handleSubmit()}
          disabled={saving || !form.code || !form.name || !form.buildingId}
        >
          {saving ? "Saving…" : existing ? "Save changes" : "Create room"}
        </Button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function ToggleField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-2 py-1">
      <Switch checked={checked} onCheckedChange={onChange} />
      <span className="text-sm text-foreground">{label}</span>
    </div>
  );
}
