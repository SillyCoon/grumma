import "dotenv/config";
import { db } from "./index";
import { grammarPoints, exercises } from "./schema";

const grammarPointsData: (typeof grammarPoints.$inferInsert)[] = [
  {
    id: 1,
    order: 1,
    shortTitle: "nominative",
    title: "Nominative Case (Именительный падеж)",
    structure: "Кто? Что?",
    detailedTitle: "The Case of the Subject",
    englishTitle: "Who? What?",
    torfl: "A1",
  },
  {
    id: 2,
    order: 2,
    shortTitle: "genitive",
    title: "Genitive Case (Родительный падеж)",
    structure: "Кого? Чего?",
    detailedTitle: "The Case of Possession",
    englishTitle: "Whose? Of what?",
    torfl: "A1",
  },
  {
    id: 3,
    order: 3,
    shortTitle: "dative",
    title: "Dative Case (Дательный падеж)",
    structure: "Кому? Чему?",
    detailedTitle: "The Case of Indirect Object",
    englishTitle: "To whom? To what?",
    torfl: "A2",
  },
  {
    id: 4,
    order: 4,
    shortTitle: "accusative",
    title: "Accusative Case (Винительный падеж)",
    structure: "Кого? Что?",
    detailedTitle: "The Case of Direct Object",
    englishTitle: "Whom? What?",
    torfl: "A1",
  },
  {
    id: 5,
    order: 5,
    shortTitle: "instrumental",
    title: "Instrumental Case (Творительный падеж)",
    structure: "Кем? Чем?",
    detailedTitle: "The Case of Agent",
    englishTitle: "By whom? By what?",
    torfl: "A2",
  },
  {
    id: 6,
    order: 6,
    shortTitle: "prepositional",
    title: "Prepositional Case (Предложный падеж)",
    structure: "О ком? О чём?",
    detailedTitle: "The Case of Location",
    englishTitle: "About whom? About what?",
    torfl: "A1",
  },
  {
    id: 7,
    order: 7,
    shortTitle: "present-simple",
    title: "Present Simple Tense",
    structure: "Я делаю",
    detailedTitle: "Simple Present Actions",
    englishTitle: "I do",
    torfl: "A1",
  },
  {
    id: 8,
    order: 8,
    shortTitle: "past-simple",
    title: "Past Simple Tense",
    structure: "Я делал(а)",
    detailedTitle: "Simple Past Actions",
    englishTitle: "I did",
    torfl: "A1",
  },
  {
    id: 9,
    order: 9,
    shortTitle: "future-simple",
    title: "Future Simple Tense",
    structure: "Я буду делать",
    detailedTitle: "Simple Future Actions",
    englishTitle: "I will do",
    torfl: "A2",
  },
  {
    id: 10,
    order: 10,
    shortTitle: "aspect",
    title: "Verbal Aspect (Вид глагола)",
    structure: "Perfective vs Imperfective",
    detailedTitle: "Understanding Aspect in Russian",
    englishTitle: "Completed vs Ongoing Actions",
    torfl: "A2",
  },
];

const exercisesData: (typeof exercises.$inferInsert)[] = [
  // Nominative case exercises (grammarPointId: 1)
  {
    grammarPointId: 1,
    order: 1,
    ru: "%Кто% это?",
    en: "%Who% is this?",
    helper: "",
  },
  {
    grammarPointId: 1,
    order: 2,
    ru: "%Это кот%.",
    en: "%This is a cat%.",
    helper: "",
  },
  {
    grammarPointId: 1,
    order: 3,
    ru: "%Кто говорит%?",
    en: "%Who is speaking%?",
    helper: "",
  },
  {
    grammarPointId: 1,
    order: 4,
    ru: "%Я студент%.",
    en: "%I am a student%.",
    helper: "",
  },

  // Genitive case exercises (grammarPointId: 2)
  {
    grammarPointId: 2,
    order: 1,
    ru: "%Чего% нет?",
    en: "%What% is missing?",
    helper: "",
  },
  {
    grammarPointId: 2,
    order: 2,
    ru: "Нет %воды%.",
    en: "There is no %water%.",
    helper: "",
  },
  {
    grammarPointId: 2,
    order: 3,
    ru: "Книга %студента%.",
    en: "The %student's% book.",
    helper: "",
  },
  {
    grammarPointId: 2,
    order: 4,
    ru: "Дом %дерева%.",
    en: "A %wooden% house.",
    helper: "",
  },

  // Dative case exercises (grammarPointId: 3)
  {
    grammarPointId: 3,
    order: 1,
    ru: "Я дам книгу %другу%.",
    en: "I will give the book to a %friend%.",
    helper: "",
  },
  {
    grammarPointId: 3,
    order: 2,
    ru: "Он помогает %матери%.",
    en: "He helps his %mother%.",
    helper: "",
  },
  {
    grammarPointId: 3,
    order: 3,
    ru: "Это письмо %учителю%.",
    en: "This letter is for the %teacher%.",
    helper: "",
  },
  {
    grammarPointId: 3,
    order: 4,
    ru: "%Мне% нравится музыка.",
    en: "%I% like music.",
    helper: "",
  },

  // Accusative case exercises (grammarPointId: 4)
  {
    grammarPointId: 4,
    order: 1,
    ru: "Я вижу %кота%.",
    en: "I see the %cat%.",
    helper: "",
  },
  {
    grammarPointId: 4,
    order: 2,
    ru: "Он читает %книгу%.",
    en: "He reads a %book%.",
    helper: "",
  },
  {
    grammarPointId: 4,
    order: 3,
    ru: "Они любят %города%.",
    en: "They love the %cities%.",
    helper: "",
  },
  {
    grammarPointId: 4,
    order: 4,
    ru: "%Каждый день% я гуляю в парке.",
    en: "%Every day% I walk in the park.",
    helper: "",
  },

  // Instrumental case exercises (grammarPointId: 5)
  {
    grammarPointId: 5,
    order: 1,
    ru: "Я пишу %ручкой%.",
    en: "I write with a %pen%.",
    helper: "",
  },
  {
    grammarPointId: 5,
    order: 2,
    ru: "Он работает %учителем%.",
    en: "He works as a %teacher%.",
    helper: "",
  },
  {
    grammarPointId: 5,
    order: 3,
    ru: "Путешествуют %поездом%.",
    en: "They travel by %train%.",
    helper: "",
  },
  {
    grammarPointId: 5,
    order: 4,
    ru: "Это музей %искусства%.",
    en: "This is an art %museum%.",
    helper: "",
  },

  // Prepositional case exercises (grammarPointId: 6)
  {
    grammarPointId: 6,
    order: 1,
    ru: "Я живу %в доме%.",
    en: "I live %in a house%.",
    helper: "",
  },
  {
    grammarPointId: 6,
    order: 2,
    ru: "Он говорит %о фильме%.",
    en: "He is talking %about the film%.",
    helper: "",
  },
  {
    grammarPointId: 6,
    order: 3,
    ru: "Книга %на столе%.",
    en: "The book is %on the table%.",
    helper: "",
  },
  {
    grammarPointId: 6,
    order: 4,
    ru: "%При университете% есть библиотека.",
    en: "%At the university% there is a library.",
    helper: "",
  },

  // Present tense exercises (grammarPointId: 7)
  {
    grammarPointId: 7,
    order: 1,
    ru: "%Я читаю%.",
    en: "%I read%.",
    helper: "",
  },
  {
    grammarPointId: 7,
    order: 2,
    ru: "Он %говорит% по-русски.",
    en: "He %speaks% Russian.",
    helper: "",
  },
  {
    grammarPointId: 7,
    order: 3,
    ru: "Они %живут% в городе.",
    en: "They %live% in the city.",
    helper: "",
  },
  {
    grammarPointId: 7,
    order: 4,
    ru: "Мы %учимся% в школе.",
    en: "We %study% at school.",
    helper: "",
  },

  // Past tense exercises (grammarPointId: 8)
  {
    grammarPointId: 8,
    order: 1,
    ru: "%Я читал% книгу.",
    en: "%I read% a book.",
    helper: "",
  },
  {
    grammarPointId: 8,
    order: 2,
    ru: "%Она писала% письмо.",
    en: "%She was writing% a letter.",
    helper: "",
  },
  {
    grammarPointId: 8,
    order: 3,
    ru: "%Они жили% в деревне.",
    en: "%They lived% in a village.",
    helper: "",
  },
  {
    grammarPointId: 8,
    order: 4,
    ru: "%Я был% в Москве.",
    en: "%I was% in Moscow.",
    helper: "",
  },

  // Future tense exercises (grammarPointId: 9)
  {
    grammarPointId: 9,
    order: 1,
    ru: "%Я буду читать%.",
    en: "%I will read%.",
    helper: "",
  },
  {
    grammarPointId: 9,
    order: 2,
    ru: "Он %напишет% письмо.",
    en: "He %will write% a letter.",
    helper: "",
  },
  {
    grammarPointId: 9,
    order: 3,
    ru: "Они %будут жить% здесь.",
    en: "They %will live% here.",
    helper: "",
  },
  {
    grammarPointId: 9,
    order: 4,
    ru: "%Завтра я буду% дома.",
    en: "%Tomorrow I will be% at home.",
    helper: "",
  },

  // Aspect exercises (grammarPointId: 10)
  {
    grammarPointId: 10,
    order: 1,
    ru: "%Я пишу% письмо.",
    en: "%I am writing% a letter.",
    helper: "",
  },
  {
    grammarPointId: 10,
    order: 2,
    ru: "%Я написал% письмо.",
    en: "%I wrote% a letter.",
    helper: "",
  },
  {
    grammarPointId: 10,
    order: 3,
    ru: "%читать% vs %прочитать%",
    en: "%to read% vs %to finish reading%",
    helper: "",
  },
  {
    grammarPointId: 10,
    order: 4,
    ru: "%Я буду читать% книгу.",
    en: "%I will be reading% the book.",
    helper: "",
  },
];

const seed = async () => {
  try {
    console.log("🌱 Starting database seed...");
    console.log("Cleaning existing data...");
    await db.delete(exercises);
    await db.delete(grammarPoints);
    console.log("✅ Cleaned existing data.");

    // Insert grammar points
    console.log("Inserting grammar points...");
    await db.insert(grammarPoints).values(grammarPointsData);
    console.log("✅ Inserted 10 grammar points");

    // Insert exercises
    console.log("Inserting exercises...");
    await db.insert(exercises).values(exercisesData);
    console.log("✅ Inserted 40 exercises");

    console.log("Seed completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
};

seed();
