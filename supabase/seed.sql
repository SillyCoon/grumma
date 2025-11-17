-- Mock seed data for local development
-- This file is automatically loaded by Supabase when running `supabase start` or `supabase db reset`

-- Insert mock grammar points
INSERT INTO "grumma"."grammar_point" (id, "order", "shortTitle", title, structure, "detailedTitle", "englishTitle", torfl)
VALUES
  (1, 1, 'nominative', 'Nominative Case (Именительный падеж)', 'Кто? Что?', 'The Case of the Subject', 'Who? What?', 'A1'),
  (2, 2, 'genitive', 'Genitive Case (Родительный падеж)', 'Кого? Чего?', 'The Case of Possession', 'Whose? Of what?', 'A1'),
  (3, 3, 'dative', 'Dative Case (Дательный падеж)', 'Кому? Чему?', 'The Case of Indirect Object', 'To whom? To what?', 'A2'),
  (4, 4, 'accusative', 'Accusative Case (Винительный падеж)', 'Кого? Что?', 'The Case of Direct Object', 'Whom? What?', 'A1'),
  (5, 5, 'instrumental', 'Instrumental Case (Творительный падеж)', 'Кем? Чем?', 'The Case of Agent', 'By whom? By what?', 'A2'),
  (6, 6, 'prepositional', 'Prepositional Case (Предложный падеж)', 'О ком? О чём?', 'The Case of Location', 'About whom? About what?', 'A1'),
  (7, 7, 'present-simple', 'Present Simple Tense', 'Я делаю', 'Simple Present Actions', 'I do', 'A1'),
  (8, 8, 'past-simple', 'Past Simple Tense', 'Я делал(а)', 'Simple Past Actions', 'I did', 'A1'),
  (9, 9, 'future-simple', 'Future Simple Tense', 'Я буду делать', 'Simple Future Actions', 'I will do', 'A2'),
  (10, 10, 'aspect', 'Verbal Aspect (Вид глагола)', 'Perfective vs Imperfective', 'Understanding Aspect in Russian', 'Completed vs Ongoing Actions', 'A2');

-- Insert mock exercises for nominative case
INSERT INTO "grumma"."exercise" ("grammarPointId", "order", ru, en, helper)
VALUES
  (1, 1, '%Кто% это?', '%Who% is this?', ''),
  (1, 2, '%Это кот%.', '%This is a cat%.', ''),
  (1, 3, '%Кто говорит%?', '%Who is speaking%?', ''),
  (1, 4, '%Я студент%.', '%I am a student%.', '');

-- Insert mock exercises for genitive case
INSERT INTO "grumma"."exercise" ("grammarPointId", "order", ru, en, helper)
VALUES
  (2, 1, '%Чего% нет?', '%What% is missing?', ''),
  (2, 2, 'Нет %воды%.', 'There is no %water%.', ''),
  (2, 3, 'Книга %студента%.', 'The %student''s% book.', ''),
  (2, 4, 'Дом %дерева%.', 'A %wooden% house.', '');

-- Insert mock exercises for dative case
INSERT INTO "grumma"."exercise" ("grammarPointId", "order", ru, en, helper)
VALUES
  (3, 1, 'Я дам книгу %другу%.', 'I will give the book to a %friend%.', ''),
  (3, 2, 'Он помогает %матери%.', 'He helps his %mother%.', ''),
  (3, 3, 'Это письмо %учителю%.', 'This letter is for the %teacher%.', ''),
  (3, 4, '%Мне% нравится музыка.', '%I% like music.', '');

-- Insert mock exercises for accusative case
INSERT INTO "grumma"."exercise" ("grammarPointId", "order", ru, en, helper)
VALUES
  (4, 1, 'Я вижу %кота%.', 'I see the %cat%.', ''),
  (4, 2, 'Он читает %книгу%.', 'He reads a %book%.', ''),
  (4, 3, 'Они любят %города%.', 'They love the %cities%.', ''),
  (4, 4, '%Каждый день% я гуляю в парке.', '%Every day% I walk in the park.', '');

-- Insert mock exercises for instrumental case
INSERT INTO "grumma"."exercise" ("grammarPointId", "order", ru, en, helper)
VALUES
  (5, 1, 'Я пишу %ручкой%.', 'I write with a %pen%.', ''),
  (5, 2, 'Он работает %учителем%.', 'He works as a %teacher%.', ''),
  (5, 3, 'Путешествуют %поездом%.', 'They travel by %train%.', ''),
  (5, 4, 'Это музей %искусства%.', 'This is an art %museum%.', '');

-- Insert mock exercises for prepositional case
INSERT INTO "grumma"."exercise" ("grammarPointId", "order", ru, en, helper)
VALUES
  (6, 1, 'Я живу %в доме%.', 'I live %in a house%.', ''),
  (6, 2, 'Он говорит %о фильме%.', 'He is talking %about the film%.', ''),
  (6, 3, 'Книга %на столе%.', 'The book is %on the table%.', ''),
  (6, 4, '%При университете% есть библиотека.', '%At the university% there is a library.', '');

-- Insert mock exercises for present tense
INSERT INTO "grumma"."exercise" ("grammarPointId", "order", ru, en, helper)
VALUES
  (7, 1, '%Я читаю%.', '%I read%.', ''),
  (7, 2, 'Он %говорит% по-русски.', 'He %speaks% Russian.', ''),
  (7, 3, 'Они %живут% в городе.', 'They %live% in the city.', ''),
  (7, 4, 'Мы %учимся% в школе.', 'We %study% at school.', '');

-- Insert mock exercises for past tense
INSERT INTO "grumma"."exercise" ("grammarPointId", "order", ru, en, helper)
VALUES
  (8, 1, '%Я читал% книгу.', '%I read% a book.', ''),
  (8, 2, '%Она писала% письмо.', '%She was writing% a letter.', ''),
  (8, 3, '%Они жили% в деревне.', '%They lived% in a village.', ''),
  (8, 4, '%Я был% в Москве.', '%I was% in Moscow.', '');

-- Insert mock exercises for future tense
INSERT INTO "grumma"."exercise" ("grammarPointId", "order", ru, en, helper)
VALUES
  (9, 1, '%Я буду читать%.', '%I will read%.', ''),
  (9, 2, 'Он %напишет% письмо.', 'He %will write% a letter.', ''),
  (9, 3, 'Они %будут жить% здесь.', 'They %will live% here.', ''),
  (9, 4, '%Завтра я буду% дома.', '%Tomorrow I will be% at home.', '');

-- Insert mock exercises for aspect
INSERT INTO "grumma"."exercise" ("grammarPointId", "order", ru, en, helper)
VALUES
  (10, 1, '%Я пишу% письмо.', '%I am writing% a letter.', ''),
  (10, 2, '%Я написал% письмо.', '%I wrote% a letter.', ''),
  (10, 3, '%читать% vs %прочитать%', '%to read% vs %to finish reading%', ''),
  (10, 4, '%Я буду читать% книгу.', '%I will be reading% the book.', '');
