export type Building = "Zentrum" | "Irchel" | "Oerlikon";

export type SeatingStyle = "Theatre" | "Classroom" | "Boardroom" | "Standing" | "Flexible";

export interface Accessibility {
  wheelchairAccessible: boolean;
  wheelchairWc: boolean;
  stairLift: boolean;
  wheelchairParking: boolean;
  hearingLoop: boolean;
  notes?: string;
}

export interface Amenities {
  seatingStyle: SeatingStyle[];
  projector: boolean;
  whiteboard: boolean;
  videoConferencing: boolean;
  naturalLight: boolean;
}

export interface Room {
  id: string;
  name: string;
  shortCode: string;
  building: Building;
  address: string;
  capacity: number;
  description: string;
  features: string[];
  image: string;
  imageAlt: string;
  imageCredit?: string;
  accessibility: Accessibility;
  amenities: Amenities;
  sourceUrl: string;
}

export const rooms: Room[] = [
  {
    id: "hah-e-03",
    name: "HAH-E-03 Hörsaal",
    shortCode: "HAH-E-03",
    building: "Zentrum",
    address: "Häldeliweg, 8044 Zürich",
    capacity: 150,
    description:
      "A bright, tiered lecture hall in the Häldeliweg building, well suited for lectures, symposia and mid-sized conferences in the heart of the UZH Zentrum campus.",
    features: ["Wheelchair accessible", "Hearing loop", "Tiered seating", "Lecture capture"],
    image: "/images/rooms/hah-e-03.jpg",
    imageAlt: "Large tiered university lecture hall with rows of seating",
    imageCredit: "Brown University (Wikimedia Commons, CC BY-SA)",
    accessibility: {
      wheelchairAccessible: true,
      wheelchairWc: true,
      stairLift: false,
      wheelchairParking: true,
      hearingLoop: true,
      notes: "Level access from the Häldeliweg entrance; two wheelchair spaces in the front row.",
    },
    amenities: {
      seatingStyle: ["Theatre"],
      projector: true,
      whiteboard: true,
      videoConferencing: true,
      naturalLight: true,
    },
    sourceUrl:
      "https://www.campuskultur.uzh.ch/en/campusnutzung-und-bewilligungen/raeume/lehr-und-veranstaltungsraeume/raeumlichkeiten/eventraeume/rauminformation_HAH-E-3.html",
  },
  {
    id: "kol-lichthof",
    name: "KOL Lichthof",
    shortCode: "KOL",
    building: "Zentrum",
    address: "Rämistrasse 71, 8006 Zürich",
    capacity: 500,
    description:
      "The historic glass-roofed atrium of the UZH main building — a landmark event space for receptions, exhibitions, the Dies Academicus and large-scale gatherings.",
    features: ["Wheelchair accessible", "Historical architecture", "Large event space", "Natural light"],
    image: "/images/rooms/kol-lichthof.jpg",
    imageAlt: "The historic glass-roofed Lichthof atrium at UZH's main building",
    imageCredit: "Campus Culture UZH",
    accessibility: {
      wheelchairAccessible: true,
      wheelchairWc: true,
      stairLift: true,
      wheelchairParking: true,
      hearingLoop: false,
      notes: "Main building is fully step-free via the Rämistrasse 71 entrance and the KOL elevators.",
    },
    amenities: {
      seatingStyle: ["Standing", "Flexible"],
      projector: false,
      whiteboard: false,
      videoConferencing: false,
      naturalLight: true,
    },
    sourceUrl:
      "https://www.campuskultur.uzh.ch/en/campusnutzung-und-bewilligungen/raeume/lehr-und-veranstaltungsraeume/raeumlichkeiten/eventraeume/rauminformation_KOL-lichthof.html",
  },
  {
    id: "kol-f-101",
    name: "KOL-F-101 Hörsaal",
    shortCode: "KOL-F-101",
    building: "Zentrum",
    address: "Rämistrasse 71, 8006 Zürich",
    capacity: 250,
    description:
      "A large, well-equipped lecture hall on the F floor of the UZH main building, popular for keynote lectures, panel discussions and hybrid conferences.",
    features: ["Hearing loop", "Wheelchair accessible", "Hybrid-ready", "Tiered seating"],
    image: "/images/rooms/kol-f-101.jpg",
    imageAlt: "Modern university auditorium with tiered seating facing a stage",
    imageCredit: "Cornell University (Wikimedia Commons, CC BY-SA)",
    accessibility: {
      wheelchairAccessible: true,
      wheelchairWc: true,
      stairLift: false,
      wheelchairParking: true,
      hearingLoop: true,
      notes: "Reserved wheelchair seating at the rear of the hall, close to the accessible entrance.",
    },
    amenities: {
      seatingStyle: ["Theatre"],
      projector: true,
      whiteboard: true,
      videoConferencing: true,
      naturalLight: false,
    },
    sourceUrl:
      "https://www.campuskultur.uzh.ch/en/campusnutzung-und-bewilligungen/raeume/lehr-und-veranstaltungsraeume/raeumlichkeiten/eventraeume/rauminformation_KOL-F-101.html",
  },
  {
    id: "kol-g-201",
    name: "KOL-G-201 Aula",
    shortCode: "KOL-G-201",
    building: "Zentrum",
    address: "Rämistrasse 71, 8006 Zürich",
    capacity: 400,
    description:
      "UZH's grand ceremonial Aula — a stately hall with exceptional acoustics, traditionally used for graduations, the Dies Academicus and formal university ceremonies.",
    features: ["Limited wheelchair access", "Grand acoustics", "Historic hall", "Balcony seating"],
    image: "/images/rooms/kol-g-201.jpg",
    imageAlt: "Grand historic university auditorium hall with high ceiling",
    imageCredit: "University of Illinois (Wikimedia Commons, CC BY-SA)",
    accessibility: {
      wheelchairAccessible: true,
      wheelchairWc: false,
      stairLift: true,
      wheelchairParking: false,
      hearingLoop: false,
      notes: "Ground-floor access only; the balcony level is reached by stairs. Contact Raumdisposition ahead of your event to arrange step-free seating.",
    },
    amenities: {
      seatingStyle: ["Theatre"],
      projector: true,
      whiteboard: false,
      videoConferencing: false,
      naturalLight: true,
    },
    sourceUrl:
      "https://www.campuskultur.uzh.ch/en/campusnutzung-und-bewilligungen/raeume/lehr-und-veranstaltungsraeume/raeumlichkeiten/eventraeume/rauminformation_KOL-G-201.html",
  },
  {
    id: "kum-e-01-02-03",
    name: "KUM-E-01/02/03 Sitzungszimmer",
    shortCode: "KUM-E-01/02/03",
    building: "Zentrum",
    address: "Stockargut, Künstlergasse 15, 8001 Zürich",
    capacity: 30,
    description:
      "Three combinable meeting rooms in the Stockargut building — flexible for small seminars, committee meetings and workshops, with movable partitions to scale the space up or down.",
    features: ["Combinable meeting rooms", "Standard accessibility", "Movable partitions"],
    image: "/images/rooms/kum-sitzungszimmer.jpg",
    imageAlt: "Modern meeting room with chairs arranged around a table",
    imageCredit: "Unsplash / Wikimedia Commons",
    accessibility: {
      wheelchairAccessible: true,
      wheelchairWc: true,
      stairLift: false,
      wheelchairParking: true,
      hearingLoop: false,
      notes: "Step-free access from Künstlergasse; standard accessible WC on the same floor.",
    },
    amenities: {
      seatingStyle: ["Boardroom", "Classroom", "Flexible"],
      projector: true,
      whiteboard: true,
      videoConferencing: true,
      naturalLight: true,
    },
    sourceUrl:
      "https://www.campuskultur.uzh.ch/en/campusnutzung-und-bewilligungen/raeume/lehr-und-veranstaltungsraeume/raeumlichkeiten/eventraeume/rauminformation_KUM-E-01_02_03.html",
  },
];

export function capacityBucket(capacity: number): "lt50" | "mid" | "gt100" {
  if (capacity < 50) return "lt50";
  if (capacity <= 100) return "mid";
  return "gt100";
}
