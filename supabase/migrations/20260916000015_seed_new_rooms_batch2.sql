-- Second batch of real UZH rooms, added 2026-09-16 — 96 rooms across 10
-- new buildings (FRE, GLT, KAB, PLD, RAI, RAK, SOC, SOD, SOE, SOF) plus
-- additions to 5 existing ones (HAH, KO2, KOL, KUM, RAA). Sourced the same
-- way as the original 26-room seed: capacity/accessibility from each
-- room's Uniability page (uniability.uzh.ch/static/current/buildings/
-- <CODE>/rooms/<ROOM>/), cross-checked against the user-supplied list.
--
-- Deliberately excluded (not genuinely separate bookable rooms):
--   KOL-E-12   -- an antechamber/corridor into staff room E-11, not itself bookable
--   KOL-G-216  -- does not appear in Uniability's KOL room index; likely a typo
--   "X Apero area" duplicates (KAB-G-01, RAI-*-041, SOC-F-106, RAA courtyard)
--     -- same physical room as its base entry, just its reception-mode capacity;
--     folded into that room's accessibility_notes instead of a second row
--   "Cafeteria upstairs, zfv" -- same physical space as the already-seeded
--     "Restaurant UniTurm / Mensa oben"
--   HAH-E-03/E-10/E-11, KO2-F-180, KOH-B-10, KOL-F-101/G-201/H-312, RAA-G-01,
--   KUM-E-01/02/03 -- already exist from the original 26-room seed
--
-- A handful of rooms (KOL-D-2, KOL-E-13, KO2-G-275) don't have capacity
-- published on Uniability (marked "under review" there); user-supplied
-- capacity is used for those instead, noted in accessibility_notes where
-- the gap is more than just capacity.
--
-- Images: downloading ~90 unique room photos wasn't practical at this
-- batch size. Rooms without their own catalogued photo reuse an existing
-- real UZH photo for their category (a lecture hall, seminar room,
-- auditorium, or dining photo already in this repo) as a clearly-labelled
-- stand-in -- see each room's accessibility_notes. Swap in a real photo
-- per room later if/when that's worth the effort.

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'fre-d-14', 'FRE-D-14 Seminarraum', 'FRE-D-14',
  (select id from buildings where code = 'FRE'),
  (select id from room_types where slug = 'seminar-room'),
  30,
  'A seminar room in the Freiestrasse 36 building (FRE), near UZH''s central campus.', '{"Wheelchair accessible"}',
  '/images/rooms/kol-h-312/1.jpg', 'FRE-D-14 Seminarraum room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Classroom"}', true, true, false, false,
  true, false, false, 116, 0,
  'Representative photo of a UZH seminar room (KOL-H-312) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'fre-d-15', 'FRE-D-15 Seminarraum', 'FRE-D-15',
  (select id from buildings where code = 'FRE'),
  (select id from room_types where slug = 'seminar-room'),
  30,
  'A seminar room in the Freiestrasse 36 building (FRE), with flexible (non-fixed) seating.', '{"Wheelchair accessible"}',
  '/images/rooms/kol-h-312/1.jpg', 'FRE-D-15 Seminarraum room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Classroom"}', true, true, false, false,
  true, false, false, 116, 0,
  'Representative photo of a UZH seminar room (KOL-H-312) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'glt-a-01', 'GLT-A-01', 'GLT-A-01',
  (select id from buildings where code = 'GLT'),
  (select id from room_types where slug = 'seminar-room'),
  22,
  'A workshop-style seminar room in the Pestalozzistrasse 2 building (GLT), horseshoe seating.', '{"Wheelchair accessible"}',
  '/images/rooms/kol-h-312/1.jpg', 'GLT-A-01 room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Classroom"}', true, true, false, false,
  true, false, false, 91, 0,
  'Representative photo of a UZH seminar room (KOL-H-312) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'glt-a-02', 'GLT-A-02', 'GLT-A-02',
  (select id from buildings where code = 'GLT'),
  (select id from room_types where slug = 'seminar-room'),
  22,
  'A workshop-style seminar room in the Pestalozzistrasse 2 building (GLT), horseshoe seating.', '{"Wheelchair accessible"}',
  '/images/rooms/kol-h-312/1.jpg', 'GLT-A-02 room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Classroom"}', true, true, false, false,
  true, false, false, 91, 0,
  'Representative photo of a UZH seminar room (KOL-H-312) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'glt-a-03', 'GLT-A-03', 'GLT-A-03',
  (select id from buildings where code = 'GLT'),
  (select id from room_types where slug = 'seminar-room'),
  33,
  'A workshop-style seminar room in the Pestalozzistrasse 2 building (GLT), horseshoe seating with two extra rows.', '{"Wheelchair accessible"}',
  '/images/rooms/kol-h-312/1.jpg', 'GLT-A-03 room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Classroom"}', true, true, false, false,
  true, false, false, 91, 0,
  'Representative photo of a UZH seminar room (KOL-H-312) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'glt-a-04', 'GLT-A-04', 'GLT-A-04',
  (select id from buildings where code = 'GLT'),
  (select id from room_types where slug = 'seminar-room'),
  12,
  'A small workshop room in the Pestalozzistrasse 2 building (GLT) — four square tables facing each other, up to 3 people per table.', '{"Wheelchair accessible"}',
  '/images/rooms/kol-h-312/1.jpg', 'GLT-A-04 room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Classroom"}', true, true, false, false,
  true, false, false, 91, 0,
  'Representative photo of a UZH seminar room (KOL-H-312) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'glt-b-01', 'GLT-B-01', 'GLT-B-01',
  (select id from buildings where code = 'GLT'),
  (select id from room_types where slug = 'seminar-room'),
  33,
  'A workshop-style seminar room in the Pestalozzistrasse 2 building (GLT), horseshoe seating with three rows in between.', '{"Wheelchair accessible"}',
  '/images/rooms/kol-h-312/1.jpg', 'GLT-B-01 room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Classroom"}', true, true, false, false,
  true, false, false, 91, 0,
  'Representative photo of a UZH seminar room (KOL-H-312) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'hah-e-6', 'HAH-E-6 Seminarraum', 'HAH-E-6',
  (select id from buildings where code = 'HAH'),
  (select id from room_types where slug = 'seminar-room'),
  16,
  'A small seminar room in the Häldeliweg building.', '{"Wheelchair accessible"}',
  '/images/rooms/kol-h-312/1.jpg', 'HAH-E-6 Seminarraum room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Classroom"}', true, true, false, false,
  true, false, false, 102, 0,
  'Representative photo of a UZH seminar room (KOL-H-312) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'hah-e-12', 'HAH-E-12 Foyer/Café', 'HAH-E-12',
  (select id from buildings where code = 'HAH'),
  (select id from room_types where slug = 'event-space'),
  60,
  'The foyer/café area of the Häldeliweg building — a flexible space usable for standing receptions (up to 80) or seated gatherings (up to 60).', '{"Wheelchair accessible"}',
  '/images/rooms/kol-lichthof.jpg', 'HAH-E-12 Foyer/Café room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Standing"}', false, false, false, false,
  true, false, null, 99, null,
  'Break-room-style space with work tables and vending machines; capacity varies by standing vs. seated use (up to 80 standing, 60 seated).', true
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'hah-f-1', 'HAH-F-1 Hörsaal', 'HAH-F-1',
  (select id from buildings where code = 'HAH'),
  (select id from room_types where slug = 'lecture-hall'),
  94,
  'A lecture hall on the first floor of the Häldeliweg building.', '{"Wheelchair accessible"}',
  '/images/rooms/hah-e-11/1.jpg', 'HAH-F-1 Hörsaal room view', null,
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Theatre"}', true, true, false, false,
  true, false, null, null, null,
  'Representative photo of a UZH lecture hall (HAH-E-11) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'kab-e-03', 'KAB-E-03 Seminarraum', 'KAB-E-03',
  (select id from buildings where code = 'KAB'),
  (select id from room_types where slug = 'seminar-room'),
  45,
  'A seminar room in the Kantonsschulstrasse 3 building (KAB), tables seating three each.', '{"Wheelchair accessible"}',
  '/images/rooms/kol-h-312/1.jpg', 'KAB-E-03 Seminarraum room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Classroom"}', true, true, false, false,
  true, false, null, 89, 0,
  'Representative photo of a UZH seminar room (KOL-H-312) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'kab-e-05', 'KAB-E-05 Seminarraum', 'KAB-E-05',
  (select id from buildings where code = 'KAB'),
  (select id from room_types where slug = 'seminar-room'),
  36,
  'A seminar room in the Kantonsschulstrasse 3 building (KAB), shared with the City of Zurich.', '{"Wheelchair accessible"}',
  '/images/rooms/kol-h-312/1.jpg', 'KAB-E-05 Seminarraum room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Classroom"}', true, true, false, false,
  true, false, false, 89, 0,
  'Shared use with the City of Zurich. Representative photo of a UZH seminar room (KOL-H-312) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'kab-g-01', 'KAB-G-01 Hörsaal', 'KAB-G-01',
  (select id from buildings where code = 'KAB'),
  (select id from room_types where slug = 'lecture-hall'),
  90,
  'A lecture hall in the Kantonsschulstrasse 3 building (KAB) that doubles as a reception/apéro space.', '{"Wheelchair accessible"}',
  '/images/rooms/hah-e-11/1.jpg', 'KAB-G-01 Hörsaal room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Theatre"}', true, true, false, false,
  true, false, false, 89, 0,
  'Also used in apéro/reception configuration at the same capacity. Hearing loop scheduled for repair by fall 2026. Representative photo of a UZH lecture hall (HAH-E-11) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'ko2-d-54', 'KO2-D-54 Seminarraum', 'KO2-D-54',
  (select id from buildings where code = 'KO2'),
  (select id from room_types where slug = 'seminar-room'),
  40,
  'A seminar room in the Karl-Schmid-Strasse building (KO2).', '{"Wheelchair accessible"}',
  '/images/rooms/kol-h-312/1.jpg', 'KO2-D-54 Seminarraum room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Classroom"}', true, true, false, false,
  true, false, false, 99, 0,
  'Accessed only through the KOL building. Representative photo of a UZH seminar room (KOL-H-312) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'ko2-f-150', 'KO2-F-150 Hörsaal', 'KO2-F-150',
  (select id from buildings where code = 'KO2'),
  (select id from room_types where slug = 'lecture-hall'),
  105,
  'A lecture hall in the Karl-Schmid-Strasse building (KO2), tiered seating.', '{"Wheelchair accessible","Hearing loop"}',
  '/images/rooms/hah-e-11/1.jpg', 'KO2-F-150 Hörsaal room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Theatre"}', true, true, false, false,
  true, true, true, 100, 2,
  'Representative photo of a UZH lecture hall (HAH-E-11) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'ko2-f-151', 'KO2-F-151 Seminarraum', 'KO2-F-151',
  (select id from buildings where code = 'KO2'),
  (select id from room_types where slug = 'seminar-room'),
  18,
  'A seminar room in the Karl-Schmid-Strasse building (KO2).', '{"Wheelchair accessible"}',
  '/images/rooms/kol-h-312/1.jpg', 'KO2-F-151 Seminarraum room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Classroom"}', true, true, false, false,
  true, false, false, 100, 0,
  'Representative photo of a UZH seminar room (KOL-H-312) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'ko2-f-152', 'KO2-F-152 Seminarraum', 'KO2-F-152',
  (select id from buildings where code = 'KO2'),
  (select id from room_types where slug = 'seminar-room'),
  90,
  'A large seminar room in the Karl-Schmid-Strasse building (KO2).', '{"Wheelchair accessible"}',
  '/images/rooms/kol-h-312/1.jpg', 'KO2-F-152 Seminarraum room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Classroom"}', true, true, false, false,
  true, false, false, 100, 0,
  'Representative photo of a UZH seminar room (KOL-H-312) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'ko2-f-153', 'KO2-F-153 Seminarraum', 'KO2-F-153',
  (select id from buildings where code = 'KO2'),
  (select id from room_types where slug = 'seminar-room'),
  50,
  'A seminar room in the Karl-Schmid-Strasse building (KO2).', '{"Wheelchair accessible"}',
  '/images/rooms/kol-h-312/1.jpg', 'KO2-F-153 Seminarraum room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Classroom"}', true, true, false, false,
  true, false, false, 100, 0,
  'Representative photo of a UZH seminar room (KOL-H-312) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'ko2-f-155', 'KO2-F-155 Seminarraum', 'KO2-F-155',
  (select id from buildings where code = 'KO2'),
  (select id from room_types where slug = 'seminar-room'),
  24,
  'A seminar room in the Karl-Schmid-Strasse building (KO2).', '{"Wheelchair accessible"}',
  '/images/rooms/kol-h-312/1.jpg', 'KO2-F-155 Seminarraum room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Classroom"}', true, true, false, false,
  true, false, false, 102, 0,
  'Representative photo of a UZH seminar room (KOL-H-312) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'ko2-f-172', 'KO2-F-172 Seminarraum', 'KO2-F-172',
  (select id from buildings where code = 'KO2'),
  (select id from room_types where slug = 'seminar-room'),
  40,
  'A seminar room in the Karl-Schmid-Strasse building (KO2).', '{"Wheelchair accessible"}',
  '/images/rooms/kol-h-312/1.jpg', 'KO2-F-172 Seminarraum room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Classroom"}', true, true, false, false,
  true, false, false, 100, 0,
  'Representative photo of a UZH seminar room (KOL-H-312) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'ko2-f-173', 'KO2-F-173 Gruppenraum', 'KO2-F-173',
  (select id from buildings where code = 'KO2'),
  (select id from room_types where slug = 'seminar-room'),
  18,
  'A group work room in the Karl-Schmid-Strasse building (KO2).', '{"Wheelchair accessible"}',
  '/images/rooms/kol-h-312/1.jpg', 'KO2-F-173 Gruppenraum room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Classroom"}', true, true, false, false,
  true, false, false, 100, 0,
  'Representative photo of a UZH seminar room (KOL-H-312) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'ko2-f-174', 'KO2-F-174 Seminarraum', 'KO2-F-174',
  (select id from buildings where code = 'KO2'),
  (select id from room_types where slug = 'seminar-room'),
  70,
  'A seminar room in the Karl-Schmid-Strasse building (KO2).', '{"Wheelchair accessible"}',
  '/images/rooms/kol-h-312/1.jpg', 'KO2-F-174 Seminarraum room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Classroom"}', true, true, false, false,
  true, false, false, 100, 0,
  'Representative photo of a UZH seminar room (KOL-H-312) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'ko2-f-175', 'KO2-F-175 Seminarraum', 'KO2-F-175',
  (select id from buildings where code = 'KO2'),
  (select id from room_types where slug = 'seminar-room'),
  70,
  'A seminar room in the Karl-Schmid-Strasse building (KO2), with one electrically height-adjustable table.', '{"Wheelchair accessible"}',
  '/images/rooms/kol-h-312/1.jpg', 'KO2-F-175 Seminarraum room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Classroom"}', true, true, false, false,
  true, false, false, 100, 1,
  'Representative photo of a UZH seminar room (KOL-H-312) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'ko2-g-275', 'KO2-G-275 Seminarraum', 'KO2-G-275',
  (select id from buildings where code = 'KO2'),
  (select id from room_types where slug = 'seminar-room'),
  32,
  'A seminar room on the ground floor of the Karl-Schmid-Strasse building (KO2).', '{"Wheelchair accessible"}',
  '/images/rooms/kol-h-312/1.jpg', 'KO2-G-275 Seminarraum room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Classroom"}', true, true, false, false,
  true, false, null, null, null,
  'Uniability''s listing for this room is still under review — some accessibility fields aren''t published yet. Representative photo of a UZH seminar room (KOL-H-312) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'kol-d-2', 'KOL-D-2 Sitzungszimmer', 'KOL-D-2',
  (select id from buildings where code = 'KOL'),
  (select id from room_types where slug = 'meeting-room'),
  8,
  'A small meeting room tucked below the main building, reached via a side staircase or the east lift.', '{}',
  '/images/rooms/kum-sitzungszimmer.jpg', 'KOL-D-2 Sitzungszimmer room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Boardroom"}', false, true, false, false,
  false, false, true, null, 0,
  'No step-free route — reached via an eight-step staircase (handrail on one side) even from the accessible lift route.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'kol-e-13', 'KOL-E-13 Senate Room', 'KOL-E-13',
  (select id from buildings where code = 'KOL'),
  (select id from room_types where slug = 'meeting-room'),
  40,
  'The Senate Room (Senatszimmer) of the main building — a formal meeting/event room.', '{"Wheelchair accessible"}',
  '/images/rooms/kum-sitzungszimmer.jpg', 'KOL-E-13 Senate Room room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Boardroom"}', false, true, false, false,
  true, false, null, null, 0,
  null, false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'kol-e-18', 'KOL-E-18 Hörsaal', 'KOL-E-18',
  (select id from buildings where code = 'KOL'),
  (select id from room_types where slug = 'lecture-hall'),
  90,
  'A lecture hall in the main building with terrace access.', '{"Wheelchair accessible","Hearing loop"}',
  '/images/rooms/hah-e-11/1.jpg', 'KOL-E-18 Hörsaal room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Theatre"}', true, true, false, false,
  true, true, false, 119, 1,
  'Hearing loop needs advance activation via event services. Terrace access via a narrower side door. Representative photo of a UZH lecture hall (HAH-E-11) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'kol-e-21', 'KOL-E-21', 'KOL-E-21',
  (select id from buildings where code = 'KOL'),
  (select id from room_types where slug = 'seminar-room'),
  80,
  'A seminar room in the main building, with a small reception nook to the right of the entrance.', '{"Wheelchair accessible"}',
  '/images/rooms/kol-h-312/1.jpg', 'KOL-E-21 room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Classroom"}', true, true, false, false,
  true, false, true, 104, 0,
  'Representative photo of a UZH seminar room (KOL-H-312) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'kol-f-103', 'KOL-F-103 Seminarraum', 'KOL-F-103',
  (select id from buildings where code = 'KOL'),
  (select id from room_types where slug = 'seminar-room'),
  28,
  'A seminar room in the main building.', '{"Wheelchair accessible"}',
  '/images/rooms/kol-h-312/1.jpg', 'KOL-F-103 Seminarraum room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Classroom"}', true, true, false, false,
  true, false, false, 101, 0,
  'Representative photo of a UZH seminar room (KOL-H-312) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'kol-f-104', 'KOL-F-104 Hörsaal', 'KOL-F-104',
  (select id from buildings where code = 'KOL'),
  (select id from room_types where slug = 'lecture-hall'),
  142,
  'A tiered lecture hall in the main building.', '{"Wheelchair accessible","Hearing loop"}',
  '/images/rooms/hah-e-11/1.jpg', 'KOL-F-104 Hörsaal room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Theatre"}', true, true, false, false,
  true, true, true, 116, 1,
  'Hearing loop needs advance activation via event services. Representative photo of a UZH lecture hall (HAH-E-11) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'kol-f-109', 'KOL-F-109 Hörsaal', 'KOL-F-109',
  (select id from buildings where code = 'KOL'),
  (select id from room_types where slug = 'lecture-hall'),
  84,
  'A tiered lecture hall in the main building.', '{"Wheelchair accessible","Hearing loop"}',
  '/images/rooms/hah-e-11/1.jpg', 'KOL-F-109 Hörsaal room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Theatre"}', true, true, false, false,
  true, true, true, 102, 1,
  'Hearing loop needs advance activation via event services. Representative photo of a UZH lecture hall (HAH-E-11) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'kol-f-117', 'KOL-F-117 Hörsaal', 'KOL-F-117',
  (select id from buildings where code = 'KOL'),
  (select id from room_types where slug = 'lecture-hall'),
  125,
  'A tiered lecture hall in the main building — first six rows are level access.', '{"Wheelchair accessible","Hearing loop"}',
  '/images/rooms/hah-e-11/1.jpg', 'KOL-F-117 Hörsaal room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Theatre"}', true, true, false, false,
  true, true, true, 119, 1,
  'Hearing loop needs advance activation via event services. Representative photo of a UZH lecture hall (HAH-E-11) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'kol-f-118', 'KOL-F-118 Hörsaal', 'KOL-F-118',
  (select id from buildings where code = 'KOL'),
  (select id from room_types where slug = 'lecture-hall'),
  154,
  'A tiered lecture hall in the main building — first two rows are level access, two accessible desks.', '{"Wheelchair accessible","Hearing loop"}',
  '/images/rooms/hah-e-11/1.jpg', 'KOL-F-118 Hörsaal room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Theatre"}', true, true, false, false,
  true, true, true, 119, 2,
  'Hearing loop needs advance activation via event services. Representative photo of a UZH lecture hall (HAH-E-11) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'kol-f-121', 'KOL-F-121 Hörsaal', 'KOL-F-121',
  (select id from buildings where code = 'KOL'),
  (select id from room_types where slug = 'lecture-hall'),
  142,
  'A tiered lecture hall in the main building.', '{"Wheelchair accessible","Hearing loop"}',
  '/images/rooms/hah-e-11/1.jpg', 'KOL-F-121 Hörsaal room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Theatre"}', true, true, false, false,
  true, true, true, 173, 1,
  'Hearing loop needs advance activation via event services. Representative photo of a UZH lecture hall (HAH-E-11) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'kol-f-122', 'KOL-F-122 Seminarraum', 'KOL-F-122',
  (select id from buildings where code = 'KOL'),
  (select id from room_types where slug = 'seminar-room'),
  10,
  'A small seminar room in the main building with an oval table.', '{"Wheelchair accessible"}',
  '/images/rooms/kol-h-312/1.jpg', 'KOL-F-122 Seminarraum room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Classroom"}', true, true, false, false,
  true, false, false, 105, 0,
  'Representative photo of a UZH seminar room (KOL-H-312) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'kol-f-123', 'KOL-F-123 Hörsaal', 'KOL-F-123',
  (select id from buildings where code = 'KOL'),
  (select id from room_types where slug = 'lecture-hall'),
  48,
  'A lecture hall in the main building — front row is level access.', '{"Wheelchair accessible"}',
  '/images/rooms/hah-e-11/1.jpg', 'KOL-F-123 Hörsaal room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Theatre"}', true, true, false, false,
  true, false, true, 102, 0,
  'Representative photo of a UZH lecture hall (HAH-E-11) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'kol-g-203', 'KOL-G-203 Seminarraum', 'KOL-G-203',
  (select id from buildings where code = 'KOL'),
  (select id from room_types where slug = 'seminar-room'),
  24,
  'A seminar room in the main building.', '{"Wheelchair accessible"}',
  '/images/rooms/kol-h-312/1.jpg', 'KOL-G-203 Seminarraum room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Classroom"}', true, true, false, false,
  true, false, false, 101, 0,
  'Representative photo of a UZH seminar room (KOL-H-312) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'kol-g-204', 'KOL-G-204 Hörsaal', 'KOL-G-204',
  (select id from buildings where code = 'KOL'),
  (select id from room_types where slug = 'lecture-hall'),
  85,
  'A tiered lecture hall in the main building — first row is level access.', '{"Wheelchair accessible","Hearing loop"}',
  '/images/rooms/hah-e-11/1.jpg', 'KOL-G-204 Hörsaal room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Theatre"}', true, true, false, false,
  true, true, true, 170, 1,
  'Hearing loop needs advance activation via event services. Representative photo of a UZH lecture hall (HAH-E-11) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'kol-g-209', 'KOL-G-209 Hörsaal', 'KOL-G-209',
  (select id from buildings where code = 'KOL'),
  (select id from room_types where slug = 'lecture-hall'),
  82,
  'A tiered lecture hall in the main building — first two rows are level access.', '{"Wheelchair accessible","Hearing loop"}',
  '/images/rooms/hah-e-11/1.jpg', 'KOL-G-209 Hörsaal room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Theatre"}', true, true, false, false,
  true, true, true, 102, 1,
  'Hearing loop needs advance activation via event services. Representative photo of a UZH lecture hall (HAH-E-11) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'kol-g-210', 'KOL-G-210 Seminarraum', 'KOL-G-210',
  (select id from buildings where code = 'KOL'),
  (select id from room_types where slug = 'seminar-room'),
  16,
  'A small seminar room in the main building, round table.', '{"Wheelchair accessible"}',
  '/images/rooms/kol-h-312/1.jpg', 'KOL-G-210 Seminarraum room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Classroom"}', true, true, false, false,
  true, false, false, 102, 0,
  'Representative photo of a UZH seminar room (KOL-H-312) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'kol-g-212', 'KOL-G-212 Seminarraum', 'KOL-G-212',
  (select id from buildings where code = 'KOL'),
  (select id from room_types where slug = 'seminar-room'),
  46,
  'A seminar room in the main building.', '{"Wheelchair accessible"}',
  '/images/rooms/kol-h-312/1.jpg', 'KOL-G-212 Seminarraum room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Classroom"}', true, true, false, false,
  true, false, false, 102, 0,
  'Representative photo of a UZH seminar room (KOL-H-312) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'kol-g-217', 'KOL-G-217 Hörsaal', 'KOL-G-217',
  (select id from buildings where code = 'KOL'),
  (select id from room_types where slug = 'lecture-hall'),
  125,
  'A tiered lecture hall in the main building — first six rows are level access, the last four rows are steps-only.', '{"Wheelchair accessible","Hearing loop"}',
  '/images/rooms/hah-e-11/1.jpg', 'KOL-G-217 Hörsaal room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Theatre"}', true, true, false, false,
  true, true, true, 121, 1,
  'Hearing loop needs advance activation via event services. Representative photo of a UZH lecture hall (HAH-E-11) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'kol-g-220', 'KOL-G-220 Seminarraum', 'KOL-G-220',
  (select id from buildings where code = 'KOL'),
  (select id from room_types where slug = 'seminar-room'),
  30,
  'A seminar room in the main building.', '{"Wheelchair accessible"}',
  '/images/rooms/kol-h-312/1.jpg', 'KOL-G-220 Seminarraum room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Classroom"}', true, true, false, false,
  true, false, false, 102, 0,
  'Representative photo of a UZH seminar room (KOL-H-312) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'kol-g-221', 'KOL-G-221 Hörsaal', 'KOL-G-221',
  (select id from buildings where code = 'KOL'),
  (select id from room_types where slug = 'lecture-hall'),
  84,
  'A tiered lecture hall in the main building — first two rows are level access.', '{"Wheelchair accessible"}',
  '/images/rooms/hah-e-11/1.jpg', 'KOL-G-221 Hörsaal room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Theatre"}', true, true, false, false,
  true, false, true, 104, 1,
  'Representative photo of a UZH lecture hall (HAH-E-11) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'kol-g-222', 'KOL-G-222 Seminarraum', 'KOL-G-222',
  (select id from buildings where code = 'KOL'),
  (select id from room_types where slug = 'seminar-room'),
  26,
  'A seminar room in the main building, connected internally to neighbouring room G-223.', '{"Wheelchair accessible"}',
  '/images/rooms/kol-h-312/1.jpg', 'KOL-G-222 Seminarraum room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Classroom"}', true, true, false, false,
  true, false, false, 102, 0,
  'Representative photo of a UZH seminar room (KOL-H-312) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'kol-h-309', 'KOL-H-309 Seminarraum', 'KOL-H-309',
  (select id from buildings where code = 'KOL'),
  (select id from room_types where slug = 'seminar-room'),
  32,
  'A seminar room in the main building, four rows of seating.', '{"Wheelchair accessible"}',
  '/images/rooms/kol-h-312/1.jpg', 'KOL-H-309 Seminarraum room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Classroom"}', true, true, false, false,
  true, false, false, 102, 0,
  'Representative photo of a UZH seminar room (KOL-H-312) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'kol-h-317', 'KOL-H-317 Seminarraum', 'KOL-H-317',
  (select id from buildings where code = 'KOL'),
  (select id from room_types where slug = 'seminar-room'),
  90,
  'A large seminar room in the main building.', '{"Wheelchair accessible","Hearing loop"}',
  '/images/rooms/kol-h-312/1.jpg', 'KOL-H-317 Seminarraum room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Classroom"}', true, true, false, false,
  true, true, false, 120, 1,
  'Hearing loop needs advance activation via event services. Representative photo of a UZH seminar room (KOL-H-312) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'kol-h-320', 'KOL-H-320 Seminarraum', 'KOL-H-320',
  (select id from buildings where code = 'KOL'),
  (select id from room_types where slug = 'seminar-room'),
  28,
  'A seminar room in the main building.', '{"Wheelchair accessible"}',
  '/images/rooms/kol-h-312/1.jpg', 'KOL-H-320 Seminarraum room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Classroom"}', true, true, false, false,
  true, false, false, 102, 0,
  'Representative photo of a UZH seminar room (KOL-H-312) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'kol-h-321', 'KOL-H-321 Seminarraum', 'KOL-H-321',
  (select id from buildings where code = 'KOL'),
  (select id from room_types where slug = 'seminar-room'),
  48,
  'A seminar room in the main building.', '{"Wheelchair accessible"}',
  '/images/rooms/kol-h-312/1.jpg', 'KOL-H-321 Seminarraum room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Classroom"}', true, true, false, false,
  true, false, false, 106, 0,
  'Representative photo of a UZH seminar room (KOL-H-312) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'kol-h-322', 'KOL-H-322 Seminarraum', 'KOL-H-322',
  (select id from buildings where code = 'KOL'),
  (select id from room_types where slug = 'seminar-room'),
  26,
  'A seminar room in the main building with fixed seating.', '{"Wheelchair accessible"}',
  '/images/rooms/kol-h-312/1.jpg', 'KOL-H-322 Seminarraum room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Classroom"}', true, true, false, false,
  true, false, false, 106, 0,
  'Representative photo of a UZH seminar room (KOL-H-312) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'kol-n-1', 'KOL-N-1 Seminarraum', 'KOL-N-1',
  (select id from buildings where code = 'KOL'),
  (select id from room_types where slug = 'seminar-room'),
  20,
  'A small seminar room in the main building.', '{"Wheelchair accessible"}',
  '/images/rooms/kol-h-312/1.jpg', 'KOL-N-1 Seminarraum room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Classroom"}', true, true, false, false,
  true, false, false, 80, 0,
  'Representative photo of a UZH seminar room (KOL-H-312) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'kol-k-kitchen', 'KOL-K Kitchen', 'KOL-K Kitchen',
  (select id from buildings where code = 'KOL'),
  (select id from room_types where slug = 'dining'),
  100,
  'A service kitchen in the main building supporting catered events.', '{}',
  '/images/rooms/obere-mensa/1.jpg', 'KOL-K Kitchen room view', null,
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Flexible"}', false, false, false, false,
  false, false, null, null, null,
  'Detailed accessibility data for this space isn''t published on Uniability — contact Raumdisposition to confirm before your event. Representative photo of a UZH dining space (Mensa oben) — this specific room does not have its own catalogued photo yet.', true
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'kol-north-courtyard', 'North Courtyard', 'North Courtyard',
  (select id from buildings where code = 'KOL'),
  (select id from room_types where slug = 'event-space'),
  450,
  'An open-air courtyard on the north side of the main building, used for large outdoor receptions.', '{}',
  '/images/rooms/kol-lichthof.jpg', 'North Courtyard room view', null,
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Standing"}', false, false, false, false,
  false, false, null, null, null,
  'Detailed accessibility data for this space isn''t published on Uniability — contact Raumdisposition to confirm before your event.', true
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'kol-south-courtyard', 'South Courtyard', 'South Courtyard',
  (select id from buildings where code = 'KOL'),
  (select id from room_types where slug = 'event-space'),
  250,
  'An open-air courtyard on the south side of the main building, used for outdoor receptions.', '{}',
  '/images/rooms/kol-lichthof.jpg', 'South Courtyard room view', null,
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Standing"}', false, false, false, false,
  false, false, null, null, null,
  'Detailed accessibility data for this space isn''t published on Uniability — contact Raumdisposition to confirm before your event.', true
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'kol-west-courtyard', 'West Courtyard', 'West Courtyard',
  (select id from buildings where code = 'KOL'),
  (select id from room_types where slug = 'event-space'),
  150,
  'An open-air courtyard on the west side of the main building, commonly used for poster exhibitions.', '{}',
  '/images/rooms/kol-lichthof.jpg', 'West Courtyard room view', null,
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Standing"}', false, false, false, false,
  false, false, null, null, null,
  'Typically set up for poster exhibitions — capacity is an estimate, not independently confirmed. Detailed accessibility data for this space isn''t published on Uniability — contact Raumdisposition to confirm before your event.', true
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'kum-e-1', 'KUM-E-1 Entrance Hall', 'KUM-E-1',
  (select id from buildings where code = 'KUM'),
  (select id from room_types where slug = 'event-space'),
  30,
  'The octagonal, baroque-ceilinged entrance hall of the Stockargut building, with a grand piano — bookable as a standing reception space (no tables).', '{"Wheelchair accessible"}',
  '/images/rooms/kol-lichthof.jpg', 'KUM-E-1 Entrance Hall room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Standing"}', false, false, false, false,
  true, false, null, null, null,
  null, true
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'kum-e-2', 'KUM-E-2 Sitzungszimmer', 'KUM-E-2',
  (select id from buildings where code = 'KUM'),
  (select id from room_types where slug = 'meeting-room'),
  10,
  'A small meeting room off the entrance hall of the Stockargut building.', '{"Wheelchair accessible"}',
  '/images/rooms/kum-sitzungszimmer.jpg', 'KUM-E-2 Sitzungszimmer room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Boardroom"}', false, true, false, false,
  true, false, false, 145, 4,
  null, false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'kum-e-3', 'KUM-E-3 Sitzungszimmer', 'KUM-E-3',
  (select id from buildings where code = 'KUM'),
  (select id from room_types where slug = 'meeting-room'),
  10,
  'A small meeting room off the entrance hall of the Stockargut building, with a kitchenette.', '{"Wheelchair accessible"}',
  '/images/rooms/kum-sitzungszimmer.jpg', 'KUM-E-3 Sitzungszimmer room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Boardroom"}', false, true, false, false,
  true, false, false, 150, 4,
  null, false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'pld-e-04', 'PLD-E-04 Seminarraum', 'PLD-E-04',
  (select id from buildings where code = 'PLD'),
  (select id from room_types where slug = 'seminar-room'),
  30,
  'A seminar room in the Plattenstrasse 32 building (PLD).', '{"Wheelchair accessible"}',
  '/images/rooms/kol-h-312/1.jpg', 'PLD-E-04 Seminarraum room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Classroom"}', true, true, false, false,
  true, false, false, 90, 0,
  'Representative photo of a UZH seminar room (KOL-H-312) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'raa-outdoor-apero', 'RAA Courtyard (Apéro Area)', 'RAA Courtyard',
  (select id from buildings where code = 'RAA'),
  (select id from room_types where slug = 'event-space'),
  100,
  'The outdoor courtyard of the Rämistrasse 59 building, set up for apéro-style receptions.', '{}',
  '/images/rooms/kol-lichthof.jpg', 'RAA Courtyard (Apéro Area) room view', null,
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Standing"}', false, false, false, false,
  false, false, null, null, null,
  'Detailed accessibility data for this space isn''t published on Uniability — contact Raumdisposition to confirm before your event.', true
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'raa-e-05', 'RAA-E-05 Lounge', 'RAA-E-05',
  (select id from buildings where code = 'RAA'),
  (select id from room_types where slug = 'event-space'),
  50,
  'A break-room/lounge next to the cafeteria in the Rämistrasse 59 building — doubles as cafeteria overflow seating 11:00–14:00.', '{"Wheelchair accessible"}',
  '/images/rooms/kol-lichthof.jpg', 'RAA-E-05 Lounge room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Standing"}', false, false, false, false,
  true, false, false, 98, 0,
  null, true
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'raa-e-08', 'RAA-E-08 Seminarraum', 'RAA-E-08',
  (select id from buildings where code = 'RAA'),
  (select id from room_types where slug = 'seminar-room'),
  40,
  'A seminar room in the Rämistrasse 59 building.', '{"Wheelchair accessible"}',
  '/images/rooms/kol-h-312/1.jpg', 'RAA-E-08 Seminarraum room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Classroom"}', true, true, false, false,
  true, false, false, 98, 0,
  'Representative photo of a UZH seminar room (KOL-H-312) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'raa-e-12', 'RAA-E-12 Seminarraum', 'RAA-E-12',
  (select id from buildings where code = 'RAA'),
  (select id from room_types where slug = 'seminar-room'),
  30,
  'A seminar room in the Rämistrasse 59 building.', '{"Wheelchair accessible"}',
  '/images/rooms/kol-h-312/1.jpg', 'RAA-E-12 Seminarraum room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Classroom"}', true, true, false, false,
  true, false, false, 98, 0,
  'Representative photo of a UZH seminar room (KOL-H-312) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'raa-e-21', 'RAA-E-21 Seminarraum', 'RAA-E-21',
  (select id from buildings where code = 'RAA'),
  (select id from room_types where slug = 'seminar-room'),
  30,
  'A seminar room in the Rämistrasse 59 building.', '{"Wheelchair accessible"}',
  '/images/rooms/kol-h-312/1.jpg', 'RAA-E-21 Seminarraum room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Classroom"}', true, true, false, false,
  true, false, false, 98, 0,
  'Representative photo of a UZH seminar room (KOL-H-312) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'raa-e-27', 'RAA-E-27 Seminarraum', 'RAA-E-27',
  (select id from buildings where code = 'RAA'),
  (select id from room_types where slug = 'seminar-room'),
  40,
  'A seminar room in the Rämistrasse 59 building.', '{"Wheelchair accessible"}',
  '/images/rooms/kol-h-312/1.jpg', 'RAA-E-27 Seminarraum room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Classroom"}', true, true, false, false,
  true, false, false, 98, 0,
  'Representative photo of a UZH seminar room (KOL-H-312) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'raa-e-29', 'RAA-E-29 Seminarraum', 'RAA-E-29',
  (select id from buildings where code = 'RAA'),
  (select id from room_types where slug = 'seminar-room'),
  40,
  'A seminar room in the Rämistrasse 59 building.', '{"Wheelchair accessible"}',
  '/images/rooms/kol-h-312/1.jpg', 'RAA-E-29 Seminarraum room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Classroom"}', true, true, false, false,
  true, false, false, 98, 0,
  'Representative photo of a UZH seminar room (KOL-H-312) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'raa-e-30', 'RAA-E-30 Workshop Room', 'RAA-E-30',
  (select id from buildings where code = 'RAA'),
  (select id from room_types where slug = 'seminar-room'),
  48,
  'A workshop/special room in the Rämistrasse 59 building, designed for PhD/postdoc workshops with movable whiteboard partitions.', '{"Wheelchair accessible"}',
  '/images/rooms/kol-h-312/1.jpg', 'RAA-E-30 Workshop Room room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Classroom"}', true, true, false, false,
  true, false, null, 102, 0,
  'Representative photo of a UZH seminar room (KOL-H-312) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'raa-g-15', 'RAA-G-15 Hörsaal', 'RAA-G-15',
  (select id from buildings where code = 'RAA'),
  (select id from room_types where slug = 'lecture-hall'),
  100,
  'A lecture hall in the Rämistrasse 59 building — no tables for the audience.', '{"Wheelchair accessible","Hearing loop"}',
  '/images/rooms/hah-e-11/1.jpg', 'RAA-G-15 Hörsaal room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Theatre"}', true, true, false, false,
  true, true, true, 123, 0,
  'Representative photo of a UZH lecture hall (HAH-E-11) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'rai-f-041', 'RAI-F-041 Seminarraum', 'RAI-F-041',
  (select id from buildings where code = 'RAI'),
  (select id from room_types where slug = 'seminar-room'),
  78,
  'A seminar room in the Rämistrasse 74/76 building (RAI); also used as an apéro/reception space at the same capacity.', '{"Wheelchair accessible"}',
  '/images/rooms/kol-h-312/1.jpg', 'RAI-F-041 Seminarraum room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Classroom"}', true, true, false, false,
  true, false, false, 153, 0,
  'Also used in apéro/reception configuration at the same capacity. Representative photo of a UZH seminar room (KOL-H-312) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'rai-g-041', 'RAI-G-041 Hörsaal', 'RAI-G-041',
  (select id from buildings where code = 'RAI'),
  (select id from room_types where slug = 'lecture-hall'),
  164,
  'A tiered lecture hall in the RAI building — first two rows are level access; also used as an apéro/reception space at the same capacity.', '{"Wheelchair accessible","Hearing loop"}',
  '/images/rooms/hah-e-11/1.jpg', 'RAI-G-041 Hörsaal room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Theatre"}', true, true, false, false,
  true, true, true, 100, 2,
  'Hearing loop present but currently deactivated — contact facilities to enable. Also used in apéro/reception configuration at the same capacity. Representative photo of a UZH lecture hall (HAH-E-11) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'rai-h-041', 'RAI-H-041 Hörsaal', 'RAI-H-041',
  (select id from buildings where code = 'RAI'),
  (select id from room_types where slug = 'lecture-hall'),
  164,
  'A tiered lecture hall in the RAI building — first two rows are level access; also used as an apéro/reception space at the same capacity.', '{"Wheelchair accessible","Hearing loop"}',
  '/images/rooms/hah-e-11/1.jpg', 'RAI-H-041 Hörsaal room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Theatre"}', true, true, false, false,
  true, true, true, 100, 2,
  'Hearing loop present but currently deactivated — contact facilities to enable. Also used in apéro/reception configuration at the same capacity. Representative photo of a UZH lecture hall (HAH-E-11) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'rai-j-031', 'RAI-J-031 Seminarraum', 'RAI-J-031',
  (select id from buildings where code = 'RAI'),
  (select id from room_types where slug = 'seminar-room'),
  64,
  'A seminar room in the RAI building; also used as an apéro/reception space at similar capacity.', '{"Wheelchair accessible"}',
  '/images/rooms/kol-h-312/1.jpg', 'RAI-J-031 Seminarraum room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Classroom"}', true, true, false, false,
  true, false, false, 90, 1,
  'Also used in apéro/reception configuration at a similar capacity. Representative photo of a UZH seminar room (KOL-H-312) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'rak-e-6', 'RAK-E-6 Seminarraum', 'RAK-E-6',
  (select id from buildings where code = 'RAK'),
  (select id from room_types where slug = 'seminar-room'),
  37,
  'A seminar room in the Rämistrasse 73 building (RAK).', '{"Wheelchair accessible"}',
  '/images/rooms/kol-h-312/1.jpg', 'RAK-E-6 Seminarraum room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Classroom"}', true, true, false, false,
  true, false, false, 109, 0,
  'Representative photo of a UZH seminar room (KOL-H-312) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'rak-e-7', 'RAK-E-7 Seminarraum', 'RAK-E-7',
  (select id from buildings where code = 'RAK'),
  (select id from room_types where slug = 'seminar-room'),
  22,
  'A seminar room in the Rämistrasse 73 building (RAK).', '{"Wheelchair accessible"}',
  '/images/rooms/kol-h-312/1.jpg', 'RAK-E-7 Seminarraum room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Classroom"}', true, true, false, false,
  true, false, false, 109, 0,
  'Representative photo of a UZH seminar room (KOL-H-312) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'rak-e-8', 'RAK-E-8 Hörsaal', 'RAK-E-8',
  (select id from buildings where code = 'RAK'),
  (select id from room_types where slug = 'lecture-hall'),
  106,
  'A lecture hall in the Rämistrasse 73 building (RAK) with fixed seating.', '{"Wheelchair accessible"}',
  '/images/rooms/hah-e-11/1.jpg', 'RAK-E-8 Hörsaal room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Theatre"}', true, true, false, false,
  true, false, true, 109, 0,
  'Representative photo of a UZH lecture hall (HAH-E-11) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'soc-f-101', 'SOC-F-101 Seminarraum', 'SOC-F-101',
  (select id from buildings where code = 'SOC'),
  (select id from room_types where slug = 'seminar-room'),
  40,
  'A seminar room in the Rämistrasse 69 building (SOC).', '{}',
  '/images/rooms/kol-h-312/1.jpg', 'SOC-F-101 Seminarraum room view', null,
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Classroom"}', true, true, false, false,
  false, false, null, null, null,
  'Representative photo of a UZH seminar room (KOL-H-312) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'soc-f-106', 'SOC-F-106 Hörsaal', 'SOC-F-106',
  (select id from buildings where code = 'SOC'),
  (select id from room_types where slug = 'lecture-hall'),
  164,
  'A lecture hall in the Rämistrasse 69 building (SOC); also used as an apéro/reception space at the same capacity.', '{"Wheelchair accessible"}',
  '/images/rooms/hah-e-11/1.jpg', 'SOC-F-106 Hörsaal room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Theatre"}', true, true, false, false,
  true, false, null, 120, null,
  'Also used in apéro/reception configuration at the same capacity. Representative photo of a UZH lecture hall (HAH-E-11) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'sod-1-101', 'SOD-1-101 Hörsaal', 'SOD-1-101',
  (select id from buildings where code = 'SOD'),
  (select id from room_types where slug = 'lecture-hall'),
  61,
  'A lecture hall in the Schönberggasse 9 building (SOD), reached via a stair lift from ground level.', '{"Wheelchair accessible"}',
  '/images/rooms/hah-e-11/1.jpg', 'SOD-1-101 Hörsaal room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Theatre"}', true, true, false, false,
  true, false, true, 96, 1,
  'Representative photo of a UZH lecture hall (HAH-E-11) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'sod-1-102', 'SOD-1-102 Hörsaal', 'SOD-1-102',
  (select id from buildings where code = 'SOD'),
  (select id from room_types where slug = 'lecture-hall'),
  256,
  'A large tiered lecture hall in the Schönberggasse 9 building (SOD).', '{"Wheelchair accessible"}',
  '/images/rooms/hah-e-11/1.jpg', 'SOD-1-102 Hörsaal room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Theatre"}', true, true, false, false,
  true, false, true, 83, 1,
  'Representative photo of a UZH lecture hall (HAH-E-11) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'sod-1-104', 'SOD-1-104 Hörsaal', 'SOD-1-104',
  (select id from buildings where code = 'SOD'),
  (select id from room_types where slug = 'lecture-hall'),
  80,
  'A tiered lecture hall in the Schönberggasse 9 building (SOD) — front row is level access with movable chairs.', '{"Wheelchair accessible"}',
  '/images/rooms/hah-e-11/1.jpg', 'SOD-1-104 Hörsaal room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Theatre"}', true, true, false, false,
  true, false, true, 96, 0,
  'Representative photo of a UZH lecture hall (HAH-E-11) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'soe-e-1', 'SOE-E-1 Seminarraum', 'SOE-E-1',
  (select id from buildings where code = 'SOE'),
  (select id from room_types where slug = 'seminar-room'),
  48,
  'A seminar room in the Schönberggasse 11 building (SOE).', '{"Wheelchair accessible"}',
  '/images/rooms/kol-h-312/1.jpg', 'SOE-E-1 Seminarraum room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Classroom"}', true, true, false, false,
  true, false, false, 104, 0,
  'Representative photo of a UZH seminar room (KOL-H-312) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'soe-e-2', 'SOE-E-2 Seminarraum', 'SOE-E-2',
  (select id from buildings where code = 'SOE'),
  (select id from room_types where slug = 'seminar-room'),
  48,
  'A seminar room in the Schönberggasse 11 building (SOE).', '{"Wheelchair accessible"}',
  '/images/rooms/kol-h-312/1.jpg', 'SOE-E-2 Seminarraum room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Classroom"}', true, true, false, false,
  true, false, false, 105, 0,
  'Representative photo of a UZH seminar room (KOL-H-312) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'soe-e-7', 'SOE-E-7 Seminarraum', 'SOE-E-7',
  (select id from buildings where code = 'SOE'),
  (select id from room_types where slug = 'seminar-room'),
  48,
  'A seminar room in the Schönberggasse 11 building (SOE).', '{"Wheelchair accessible"}',
  '/images/rooms/kol-h-312/1.jpg', 'SOE-E-7 Seminarraum room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Classroom"}', true, true, false, false,
  true, false, false, 104, 0,
  'Representative photo of a UZH seminar room (KOL-H-312) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'soe-e-8', 'SOE-E-8 Seminarraum', 'SOE-E-8',
  (select id from buildings where code = 'SOE'),
  (select id from room_types where slug = 'seminar-room'),
  48,
  'A seminar room in the Schönberggasse 11 building (SOE).', '{"Wheelchair accessible"}',
  '/images/rooms/kol-h-312/1.jpg', 'SOE-E-8 Seminarraum room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Classroom"}', true, true, false, false,
  true, false, false, 104, 0,
  'Representative photo of a UZH seminar room (KOL-H-312) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'soe-f-1', 'SOE-F-1 Seminarraum', 'SOE-F-1',
  (select id from buildings where code = 'SOE'),
  (select id from room_types where slug = 'seminar-room'),
  24,
  'A seminar room in the Schönberggasse 11 building (SOE).', '{}',
  '/images/rooms/kol-h-312/1.jpg', 'SOE-F-1 Seminarraum room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Classroom"}', true, true, false, false,
  false, false, false, 104, 0,
  'No step-free route from outside the building. Representative photo of a UZH seminar room (KOL-H-312) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'soe-f-11', 'SOE-F-11 Seminarraum', 'SOE-F-11',
  (select id from buildings where code = 'SOE'),
  (select id from room_types where slug = 'seminar-room'),
  18,
  'A small seminar room in the Schönberggasse 11 building (SOE).', '{}',
  '/images/rooms/kol-h-312/1.jpg', 'SOE-F-11 Seminarraum room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Classroom"}', true, true, false, false,
  false, false, false, 104, 0,
  'No step-free route from outside the building. Representative photo of a UZH seminar room (KOL-H-312) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'soe-f-12', 'SOE-F-12 Seminarraum', 'SOE-F-12',
  (select id from buildings where code = 'SOE'),
  (select id from room_types where slug = 'seminar-room'),
  18,
  'A small seminar room in the Schönberggasse 11 building (SOE).', '{}',
  '/images/rooms/kol-h-312/1.jpg', 'SOE-F-12 Seminarraum room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Classroom"}', true, true, false, false,
  false, false, false, 104, 0,
  'No step-free route from outside the building. Representative photo of a UZH seminar room (KOL-H-312) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'soe-f-2', 'SOE-F-2 Seminarraum', 'SOE-F-2',
  (select id from buildings where code = 'SOE'),
  (select id from room_types where slug = 'seminar-room'),
  48,
  'A seminar room in the Schönberggasse 11 building (SOE).', '{}',
  '/images/rooms/kol-h-312/1.jpg', 'SOE-F-2 Seminarraum room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Classroom"}', true, true, false, false,
  false, false, false, 104, 0,
  'No step-free route from outside the building. Representative photo of a UZH seminar room (KOL-H-312) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'soe-f-7', 'SOE-F-7 Seminarraum', 'SOE-F-7',
  (select id from buildings where code = 'SOE'),
  (select id from room_types where slug = 'seminar-room'),
  48,
  'A seminar room in the Schönberggasse 11 building (SOE).', '{}',
  '/images/rooms/kol-h-312/1.jpg', 'SOE-F-7 Seminarraum room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Classroom"}', true, true, false, false,
  false, false, false, 104, 0,
  'No step-free route from outside the building. Representative photo of a UZH seminar room (KOL-H-312) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'soe-f-8', 'SOE-F-8 Seminarraum', 'SOE-F-8',
  (select id from buildings where code = 'SOE'),
  (select id from room_types where slug = 'seminar-room'),
  24,
  'A seminar room in the Schönberggasse 11 building (SOE).', '{}',
  '/images/rooms/kol-h-312/1.jpg', 'SOE-F-8 Seminarraum room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Classroom"}', true, true, false, false,
  false, false, false, 104, 0,
  'No step-free route from outside the building. Representative photo of a UZH seminar room (KOL-H-312) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'soe-f-9', 'SOE-F-9 Seminarraum', 'SOE-F-9',
  (select id from buildings where code = 'SOE'),
  (select id from room_types where slug = 'seminar-room'),
  18,
  'A small seminar room in the Schönberggasse 11 building (SOE).', '{}',
  '/images/rooms/kol-h-312/1.jpg', 'SOE-F-9 Seminarraum room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Classroom"}', true, true, false, false,
  false, false, false, 104, 0,
  'No step-free route from outside the building. Representative photo of a UZH seminar room (KOL-H-312) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'sof-e-05', 'SOF-E-05 Seminarraum', 'SOF-E-05',
  (select id from buildings where code = 'SOF'),
  (select id from room_types where slug = 'seminar-room'),
  24,
  'A seminar room in the Schönberggasse 1 building (SOF).', '{"Wheelchair accessible"}',
  '/images/rooms/kol-h-312/1.jpg', 'SOF-E-05 Seminarraum room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Classroom"}', true, true, false, false,
  true, false, false, 84, 0,
  'Representative photo of a UZH seminar room (KOL-H-312) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'sof-e-07', 'SOF-E-07 Seminarraum', 'SOF-E-07',
  (select id from buildings where code = 'SOF'),
  (select id from room_types where slug = 'seminar-room'),
  24,
  'A seminar room in the Schönberggasse 1 building (SOF).', '{"Wheelchair accessible"}',
  '/images/rooms/kol-h-312/1.jpg', 'SOF-E-07 Seminarraum room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Classroom"}', true, true, false, false,
  true, false, false, 84, 0,
  'Representative photo of a UZH seminar room (KOL-H-312) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'sof-e-13', 'SOF-E-13 Seminarraum', 'SOF-E-13',
  (select id from buildings where code = 'SOF'),
  (select id from room_types where slug = 'seminar-room'),
  24,
  'A seminar room in the Schönberggasse 1 building (SOF).', '{"Wheelchair accessible"}',
  '/images/rooms/kol-h-312/1.jpg', 'SOF-E-13 Seminarraum room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Classroom"}', true, true, false, false,
  true, false, false, 85, 0,
  'Representative photo of a UZH seminar room (KOL-H-312) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'sof-e-15', 'SOF-E-15 Seminarraum', 'SOF-E-15',
  (select id from buildings where code = 'SOF'),
  (select id from room_types where slug = 'seminar-room'),
  24,
  'A seminar room in the Schönberggasse 1 building (SOF).', '{"Wheelchair accessible"}',
  '/images/rooms/kol-h-312/1.jpg', 'SOF-E-15 Seminarraum room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Classroom"}', true, true, false, false,
  true, false, false, 84, 0,
  'Representative photo of a UZH seminar room (KOL-H-312) — this specific room does not have its own catalogued photo yet.', false
);

insert into rooms (
  code, name, short_code, building_id, room_type_id, capacity, description, features,
  image_url, image_alt, image_credit, source_url,
  seating_style, has_projector, has_whiteboard, has_video_conferencing, has_natural_light,
  wheelchair_accessible, hearing_loop, steps_inside_room, door_width_cm, reserved_wheelchair_seats,
  accessibility_notes, requires_approval
) values (
  'sof-e-17', 'SOF-E-17 Seminarraum', 'SOF-E-17',
  (select id from buildings where code = 'SOF'),
  (select id from room_types where slug = 'seminar-room'),
  42,
  'A seminar room in the Schönberggasse 1 building (SOF) — the rear third of the room is a raised step.', '{"Wheelchair accessible"}',
  '/images/rooms/kol-h-312/1.jpg', 'SOF-E-17 Seminarraum room view', 'Uniability UZH',
  'https://www.del.uzh.ch/de/campusnutzung-und-bewilligungen/raeume.html',
  '{"Classroom"}', true, true, false, false,
  true, false, true, 84, 0,
  'Representative photo of a UZH seminar room (KOL-H-312) — this specific room does not have its own catalogued photo yet.', false
);