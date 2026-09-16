-- Consolidates 11 German-derived room type categories down to 6 plain-
-- English ones. 11 categories for 26 rooms (and soon ~140) was too fine-
-- grained to be useful as a filter — several types had exactly one room.
-- Reuses existing room_types rows (renaming in place) rather than
-- insert+delete so no FK churn beyond the ones being merged away.
--
--   hoersaal                          -> lecture-hall     "Lecture Hall"
--   seminarraum                       -> seminar-room     "Seminar Room"      (absorbs workshop/study rooms)
--   sitzungszimmer                    -> meeting-room     "Meeting Room"
--   aula          (+ theatersaal)     -> auditorium       "Auditorium"
--   lichthof      (+ mall, innenhof,
--                    galerie)         -> event-space      "Event & Reception Space"
--   mensa         (+ kitchen)         -> dining           "Dining & Catering"

update room_types set slug = 'lecture-hall', name = 'Lecture Hall',
  description = 'Tiered seating, built for lectures and large talks.'
  where slug = 'hoersaal';

update room_types set slug = 'seminar-room', name = 'Seminar Room',
  description = 'Smaller classroom for seminars, workshops, and study groups.'
  where slug = 'seminarraum';

update room_types set slug = 'meeting-room', name = 'Meeting Room',
  description = 'Boardroom-style room for meetings and committees.'
  where slug = 'sitzungszimmer';

update room_types set slug = 'auditorium', name = 'Auditorium',
  description = 'Formal hall for ceremonies, talks, and performances.'
  where slug = 'aula';
update rooms set room_type_id = (select id from room_types where slug = 'auditorium')
  where room_type_id = (select id from room_types where slug = 'theatersaal');
delete from room_types where slug = 'theatersaal';

update room_types set slug = 'event-space', name = 'Event & Reception Space',
  description = 'Open, flexible space for receptions, exhibitions, and mingling.'
  where slug = 'lichthof';
update rooms set room_type_id = (select id from room_types where slug = 'event-space')
  where room_type_id in (select id from room_types where slug in ('mall', 'innenhof', 'galerie'));
delete from room_types where slug in ('mall', 'innenhof', 'galerie');

update room_types set slug = 'dining', name = 'Dining & Catering',
  description = 'Campus restaurant, cafeteria, or kitchen space.'
  where slug = 'mensa';
update rooms set room_type_id = (select id from room_types where slug = 'dining')
  where room_type_id = (select id from room_types where slug = 'kitchen');
delete from room_types where slug = 'kitchen';

-- Data correction found while adding buildings for the next room batch:
-- KO2 and KOH were both seeded with KOL's address (Rämistrasse 71) —
-- wrong. Uniability's authoritative building directory
-- (uniability.uzh.ch/de/buildingsinfos.html) gives their real addresses.
update buildings set address = 'Karl-Schmid-Strasse 4, 8006 Zürich' where code = 'KO2';
update buildings set address = 'Künstlergasse 12, 8001 Zürich' where code = 'KOH';
