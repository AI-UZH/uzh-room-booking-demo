/**
 * Structured "official event request" details — mirrors the fields on
 * UZH Campus Culture's room request form (raumdisposition@campuskultur.uzh.ch)
 * for bookings that need the fuller institutional paperwork, not just a
 * quick internal meeting. Optional: left untouched, a booking has none of
 * this and behaves exactly as before.
 */
export interface EventRequestDetails {
  organizerInstitute: string;
  organizerStreet: string;
  organizerZip: string;
  organizerCity: string;
  billingInstitute: string;
  billingStreet: string;
  billingZip: string;
  billingCity: string;
  contactName: string;
  contactFirstName: string;
  contactEmail: string;
  contactPhone: string;
  eventType: string;
  interval: "one_time" | "recurring";
  speakers: string;
  participants: "uzh_only" | "uzh_and_external" | "external_only";
  freelyAccessible: boolean;
  participationFee: boolean;
  controversialSpeakers: boolean;
  catering: boolean;
  recordingRequested: boolean;
  comments: string;
  agreedToTerms: boolean;
  wantsOrderConfirmation: boolean;
}

export const DEFAULT_EVENT_REQUEST: EventRequestDetails = {
  organizerInstitute: "",
  organizerStreet: "",
  organizerZip: "",
  organizerCity: "",
  billingInstitute: "",
  billingStreet: "",
  billingZip: "",
  billingCity: "",
  contactName: "",
  contactFirstName: "",
  contactEmail: "",
  contactPhone: "",
  eventType: "",
  interval: "one_time",
  speakers: "",
  participants: "uzh_only",
  freelyAccessible: false,
  participationFee: false,
  controversialSpeakers: false,
  catering: false,
  recordingRequested: false,
  comments: "",
  agreedToTerms: false,
  wantsOrderConfirmation: true,
};

export const EVENT_TYPES: string[] = [
  "Information event",
  "Inaugural lecture (ATV)",
  "Farewell lecture",
  "Colloquium",
  "Seminar / Workshop",
  "Tutoring",
  "Meeting / Congress / Conference / Symposium",
  "Presentation / (Guest) Lecture",
  "Panel discussion",
  "PhD - Defense",
  "Lecture series / lecture",
  "Appeal speech",
  "Test",
  "Language course",
  "Exhibition / Trade Fair",
  "Aperitif / Coffee breaks / Catering",
  "Celebration / Festive Occasion / BBQ",
  "Performance: Theatre / Dance / Film / Concert",
  "Rehearsals: Theatre / Dance / Concert",
  "Session / Meeting",
  "Photo or film recordings",
  "Miscellaneous",
];

export const PARTICIPANTS_OPTIONS: { value: EventRequestDetails["participants"]; label: string }[] = [
  { value: "uzh_only", label: "Exclusively UZH members" },
  { value: "uzh_and_external", label: "UZH members and external participants" },
  { value: "external_only", label: "Exclusively external" },
];

export const INTERVAL_OPTIONS: { value: EventRequestDetails["interval"]; label: string }[] = [
  { value: "one_time", label: "One-time event" },
  { value: "recurring", label: "Recurring event" },
];

/** Both required links from the Campus Culture room request form's "Diploma" section. */
export const EVENT_REQUEST_LINKS = {
  codeOfConduct:
    "https://www.campuskultur.uzh.ch/de/campusnutzung-und-bewilligungen/raeume/lehr-und-veranstaltungsraeume/infos_antragseinreichung.html",
  moreInfo:
    "https://www.campuskultur.uzh.ch/de/campusnutzung-und-bewilligungen/raeume/lehr-und-veranstaltungsraeume/infos_antragseinreichung.html",
};

/** Whether enough of the form was filled in to be worth attaching to the booking. */
export function isEventRequestStarted(details: EventRequestDetails): boolean {
  return (
    details.eventType.trim() !== "" ||
    details.organizerInstitute.trim() !== "" ||
    details.speakers.trim() !== ""
  );
}

/** "Ruben Kranendonk" -> { firstName: "Ruben", lastName: "Kranendonk" } */
export function splitFullName(fullName: string | null): { firstName: string; lastName: string } {
  const parts = (fullName ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}
