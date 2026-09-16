-- Buildings ----------------------------------------------------------
insert into buildings (code, name, address, campus) values
  ('HAH', 'Häldeliweg', 'Häldeliweg 4, 8044 Zürich', 'Zentrum'),
  ('KOH', 'Hauptgebäude', 'Rämistrasse 71, 8006 Zürich', 'Zentrum'),
  ('KOL', 'Hauptgebäude', 'Rämistrasse 71, 8006 Zürich', 'Zentrum'),
  ('KO2', 'Hauptgebäude', 'Rämistrasse 71, 8006 Zürich', 'Zentrum'),
  ('KUM', 'Stockargut', 'Künstlergasse 15, 8001 Zürich', 'Zentrum'),
  ('RAA', 'Rämistrasse 59', 'Rämistrasse 59, 8001 Zürich', 'Zentrum'),
  ('Y04', 'Y04', 'Winterthurerstrasse 190, 8057 Zürich', 'Irchel'),
  ('Y15', 'Y15', 'Winterthurerstrasse 190, 8057 Zürich', 'Irchel'),
  ('Y21', 'Y21', 'Winterthurerstrasse 190, 8057 Zürich', 'Irchel'),
  ('Y24', 'Y24', 'Winterthurerstrasse 190, 8057 Zürich', 'Irchel'),
  ('BIN', 'Binzmühle', 'Binzmühlestrasse 14, 8050 Zürich', 'Oerlikon');

-- Room types -----------------------------------------------------------
-- Filterable "what kind of room is this" facet, shown as pills in the UI.
insert into room_types (slug, name, description) values
  ('hoersaal', 'Lecture hall (Hörsaal)', 'Tiered seating, built for lectures and large talks.'),
  ('seminarraum', 'Seminar room (Seminarraum)', 'Smaller classroom for seminars and workshops.'),
  ('sitzungszimmer', 'Meeting room (Sitzungszimmer)', 'Boardroom-style room for meetings and committees.'),
  ('aula', 'Aula', 'Ceremonial hall for graduations and formal events.'),
  ('theatersaal', 'Theatre hall (Theatersaal)', 'Stage-equipped hall for performances and panels.'),
  ('lichthof', 'Atrium (Lichthof)', 'Glass-roofed atrium for receptions and exhibitions.'),
  ('galerie', 'Gallery (Galerie)', 'Elevated gallery walkway overlooking an atrium.'),
  ('innenhof', 'Courtyard (Innenhof)', 'Open-air courtyard for outdoor events.'),
  ('mensa', 'Dining hall / restaurant (Mensa)', 'Campus restaurant, bookable outside meal service.'),
  ('mall', 'Concourse (Mall)', 'High-traffic indoor concourse for fairs and info days.'),
  ('kitchen', 'Teaching kitchen', 'Hands-on kitchen classroom for workshops.');
