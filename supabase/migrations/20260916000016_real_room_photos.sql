-- Real per-room photos for the second room batch, added 2026-09-16.
-- The batch-2 migration (20260916000015) shipped with a handful of
-- shared "representative" photos reused across rooms of the same
-- category, since downloading ~90 unique photos in one pass wasn't
-- practical at the time. This migration replaces those with each
-- room's own real photo, fetched directly from its Uniability page
-- (the first image tagged class="UniabilityImage--img" there, i.e.
-- excluding the UZH logo and accessibility-certification badge that
-- also appear on every page) -- see public/images/rooms/<code>/1.jpg.
--
-- 5 of the 96 batch-2 rooms genuinely have no Uniability page at all
-- (the service kitchen, three courtyards, one outdoor apéro area) and
-- keep their category-representative fallback image, honestly, rather
-- than a fabricated one. One room (KOL-E-13, the Senate Room) has a
-- Uniability page but no photo on it -- also kept its fallback.

update rooms set
  image_url = '/images/rooms/fre-d-14/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'fre-d-14';
update rooms set
  image_url = '/images/rooms/fre-d-15/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'fre-d-15';
update rooms set
  image_url = '/images/rooms/glt-a-01/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'glt-a-01';
update rooms set
  image_url = '/images/rooms/glt-a-02/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'glt-a-02';
update rooms set
  image_url = '/images/rooms/glt-a-03/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'glt-a-03';
update rooms set
  image_url = '/images/rooms/glt-a-04/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'glt-a-04';
update rooms set
  image_url = '/images/rooms/glt-b-01/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'glt-b-01';
update rooms set
  image_url = '/images/rooms/hah-e-6/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'hah-e-6';
update rooms set
  image_url = '/images/rooms/hah-e-12/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'hah-e-12';
update rooms set
  image_url = '/images/rooms/hah-f-1/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'hah-f-1';
update rooms set
  image_url = '/images/rooms/kab-e-03/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'kab-e-03';
update rooms set
  image_url = '/images/rooms/kab-e-05/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'kab-e-05';
update rooms set
  image_url = '/images/rooms/kab-g-01/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'kab-g-01';
update rooms set
  image_url = '/images/rooms/ko2-d-54/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'ko2-d-54';
update rooms set
  image_url = '/images/rooms/ko2-f-150/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'ko2-f-150';
update rooms set
  image_url = '/images/rooms/ko2-f-151/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'ko2-f-151';
update rooms set
  image_url = '/images/rooms/ko2-f-152/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'ko2-f-152';
update rooms set
  image_url = '/images/rooms/ko2-f-153/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'ko2-f-153';
update rooms set
  image_url = '/images/rooms/ko2-f-155/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'ko2-f-155';
update rooms set
  image_url = '/images/rooms/ko2-f-172/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'ko2-f-172';
update rooms set
  image_url = '/images/rooms/ko2-f-173/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'ko2-f-173';
update rooms set
  image_url = '/images/rooms/ko2-f-174/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'ko2-f-174';
update rooms set
  image_url = '/images/rooms/ko2-f-175/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'ko2-f-175';
update rooms set
  image_url = '/images/rooms/ko2-g-275/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'ko2-g-275';
update rooms set
  image_url = '/images/rooms/kol-d-2/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'kol-d-2';
update rooms set
  image_url = '/images/rooms/kol-e-18/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'kol-e-18';
update rooms set
  image_url = '/images/rooms/kol-e-21/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'kol-e-21';
update rooms set
  image_url = '/images/rooms/kol-f-103/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'kol-f-103';
update rooms set
  image_url = '/images/rooms/kol-f-104/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'kol-f-104';
update rooms set
  image_url = '/images/rooms/kol-f-109/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'kol-f-109';
update rooms set
  image_url = '/images/rooms/kol-f-117/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'kol-f-117';
update rooms set
  image_url = '/images/rooms/kol-f-118/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'kol-f-118';
update rooms set
  image_url = '/images/rooms/kol-f-121/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'kol-f-121';
update rooms set
  image_url = '/images/rooms/kol-f-122/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'kol-f-122';
update rooms set
  image_url = '/images/rooms/kol-f-123/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'kol-f-123';
update rooms set
  image_url = '/images/rooms/kol-g-203/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'kol-g-203';
update rooms set
  image_url = '/images/rooms/kol-g-204/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'kol-g-204';
update rooms set
  image_url = '/images/rooms/kol-g-209/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'kol-g-209';
update rooms set
  image_url = '/images/rooms/kol-g-210/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'kol-g-210';
update rooms set
  image_url = '/images/rooms/kol-g-212/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'kol-g-212';
update rooms set
  image_url = '/images/rooms/kol-g-217/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'kol-g-217';
update rooms set
  image_url = '/images/rooms/kol-g-220/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'kol-g-220';
update rooms set
  image_url = '/images/rooms/kol-g-221/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'kol-g-221';
update rooms set
  image_url = '/images/rooms/kol-g-222/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'kol-g-222';
update rooms set
  image_url = '/images/rooms/kol-h-309/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'kol-h-309';
update rooms set
  image_url = '/images/rooms/kol-h-317/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'kol-h-317';
update rooms set
  image_url = '/images/rooms/kol-h-320/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'kol-h-320';
update rooms set
  image_url = '/images/rooms/kol-h-321/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'kol-h-321';
update rooms set
  image_url = '/images/rooms/kol-h-322/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'kol-h-322';
update rooms set
  image_url = '/images/rooms/kol-n-1/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'kol-n-1';
update rooms set
  image_url = '/images/rooms/kum-e-1/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'kum-e-1';
update rooms set
  image_url = '/images/rooms/kum-e-2/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'kum-e-2';
update rooms set
  image_url = '/images/rooms/kum-e-3/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'kum-e-3';
update rooms set
  image_url = '/images/rooms/pld-e-04/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'pld-e-04';
update rooms set
  image_url = '/images/rooms/raa-e-05/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'raa-e-05';
update rooms set
  image_url = '/images/rooms/raa-e-08/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'raa-e-08';
update rooms set
  image_url = '/images/rooms/raa-e-12/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'raa-e-12';
update rooms set
  image_url = '/images/rooms/raa-e-21/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'raa-e-21';
update rooms set
  image_url = '/images/rooms/raa-e-27/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'raa-e-27';
update rooms set
  image_url = '/images/rooms/raa-e-29/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'raa-e-29';
update rooms set
  image_url = '/images/rooms/raa-e-30/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'raa-e-30';
update rooms set
  image_url = '/images/rooms/raa-g-15/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'raa-g-15';
update rooms set
  image_url = '/images/rooms/rai-f-041/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'rai-f-041';
update rooms set
  image_url = '/images/rooms/rai-g-041/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'rai-g-041';
update rooms set
  image_url = '/images/rooms/rai-h-041/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'rai-h-041';
update rooms set
  image_url = '/images/rooms/rai-j-031/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'rai-j-031';
update rooms set
  image_url = '/images/rooms/rak-e-6/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'rak-e-6';
update rooms set
  image_url = '/images/rooms/rak-e-7/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'rak-e-7';
update rooms set
  image_url = '/images/rooms/rak-e-8/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'rak-e-8';
update rooms set
  image_url = '/images/rooms/soc-f-101/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'soc-f-101';
update rooms set
  image_url = '/images/rooms/soc-f-106/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'soc-f-106';
update rooms set
  image_url = '/images/rooms/sod-1-101/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'sod-1-101';
update rooms set
  image_url = '/images/rooms/sod-1-102/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'sod-1-102';
update rooms set
  image_url = '/images/rooms/sod-1-104/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'sod-1-104';
update rooms set
  image_url = '/images/rooms/soe-e-1/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'soe-e-1';
update rooms set
  image_url = '/images/rooms/soe-e-2/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'soe-e-2';
update rooms set
  image_url = '/images/rooms/soe-e-7/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'soe-e-7';
update rooms set
  image_url = '/images/rooms/soe-e-8/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'soe-e-8';
update rooms set
  image_url = '/images/rooms/soe-f-1/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'soe-f-1';
update rooms set
  image_url = '/images/rooms/soe-f-11/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'soe-f-11';
update rooms set
  image_url = '/images/rooms/soe-f-12/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'soe-f-12';
update rooms set
  image_url = '/images/rooms/soe-f-2/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'soe-f-2';
update rooms set
  image_url = '/images/rooms/soe-f-7/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'soe-f-7';
update rooms set
  image_url = '/images/rooms/soe-f-8/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'soe-f-8';
update rooms set
  image_url = '/images/rooms/soe-f-9/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'soe-f-9';
update rooms set
  image_url = '/images/rooms/sof-e-05/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'sof-e-05';
update rooms set
  image_url = '/images/rooms/sof-e-07/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'sof-e-07';
update rooms set
  image_url = '/images/rooms/sof-e-13/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'sof-e-13';
update rooms set
  image_url = '/images/rooms/sof-e-15/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'sof-e-15';
update rooms set
  image_url = '/images/rooms/sof-e-17/1.jpg',
  image_credit = 'Uniability UZH',
  accessibility_notes = nullif(trim(both ' ' from regexp_replace(coalesce(accessibility_notes, ''), 'Representative photo of a UZH [^.]+\.', '', 'g')), '')
where code = 'sof-e-17';