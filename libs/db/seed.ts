import "dotenv/config";
import { sql } from "drizzle-orm";
import { db } from "./index";
import {
  acceptableAnswersTmp,
  exercisesTmp,
  exercisePartsTmp,
  grammarPointsTmp,
} from "./schema-tmp";

const grammarPointsData: (typeof grammarPointsTmp.$inferInsert)[] = [
  {
    id: 1,
    order: 1,
    shortTitle: "nominative",
    structure: "Кто? Что?",
    detailedTitle: "The Case of the Subject",
    englishTitle: "Who? What?",
    torfl: "A1",
    hide: false,
  },
  {
    id: 2,
    order: 2,
    shortTitle: "genitive",
    structure: "Кого? Чего?",
    detailedTitle: "The Case of Possession",
    englishTitle: "Whose? Of what?",
    torfl: "A1",
    hide: false,
  },
  {
    id: 3,
    order: 3,
    shortTitle: "dative",
    structure: "Кому? Чему?",
    detailedTitle: "The Case of Indirect Object",
    englishTitle: "To whom? To what?",
    torfl: "A2",
    hide: false,
  },
  {
    id: 4,
    order: 4,
    shortTitle: "accusative",
    structure: "Кого? Что?",
    detailedTitle: "The Case of Direct Object",
    englishTitle: "Whom? What?",
    torfl: "A1",
    hide: false,
  },
  {
    id: 5,
    order: 5,
    shortTitle: "instrumental",
    structure: "Кем? Чем?",
    detailedTitle: "The Case of Agent",
    englishTitle: "By whom? By what?",
    torfl: "A2",
    hide: false,
  },
  {
    id: 6,
    order: 6,
    shortTitle: "prepositional",
    structure: "О ком? О чём?",
    detailedTitle: "The Case of Location",
    englishTitle: "About whom? About what?",
    torfl: "A1",
    hide: false,
  },
  {
    id: 7,
    order: 7,
    shortTitle: "present-simple",
    structure: "Я делаю",
    detailedTitle: "Simple Present Actions",
    englishTitle: "I do",
    torfl: "A1",
    hide: false,
  },
  {
    id: 8,
    order: 8,
    shortTitle: "past-simple",
    structure: "Я делал(а)",
    detailedTitle: "Simple Past Actions",
    englishTitle: "I did",
    torfl: "A1",
    hide: false,
  },
  {
    id: 9,
    order: 9,
    shortTitle: "future-simple",
    structure: "Я буду делать",
    detailedTitle: "Simple Future Actions",
    englishTitle: "I will do",
    torfl: "A2",
    hide: false,
  },
  {
    id: 10,
    order: 10,
    shortTitle: "aspect",
    structure: "Perfective vs Imperfective",
    detailedTitle: "Understanding Aspect in Russian",
    englishTitle: "Completed vs Ongoing Actions",
    torfl: "A2",
    hide: true,
  },
];

type AcceptableAnswerDef = {
  text: string;
  variant: "correct" | "try-again" | "incorrect";
  description?: string;
};

type PartDef = {
  type: "text" | "answer";
  text: string;
  acceptableAnswers?: AcceptableAnswerDef[];
};

type ExerciseDef = {
  id: number;
  grammarPointId: number;
  order: number;
  ruParts: PartDef[];
  enParts: PartDef[];
};

const exercisesDef: ExerciseDef[] = [
  // ── GP 1: Nominative (Кто? Что?) ─────────────────────────────────
  {
    id: 1,
    grammarPointId: 1,
    order: 0,
    enParts: [
      { type: "text", text: "Who is this? — This is a " },
      {
        type: "answer",
        text: "student",
        acceptableAnswers: [
          { text: "pupil", variant: "correct" },
          {
            text: "the student",
            variant: "try-again",
            description: "No article needed here",
          },
        ],
      },
      { type: "text", text: "." },
    ],
    ruParts: [
      { type: "text", text: "Кто это? — Это " },
      {
        type: "answer",
        text: "студент",
        acceptableAnswers: [
          {
            text: "студентка",
            variant: "correct",
            description: "Female student",
          },
          {
            text: "студента",
            variant: "try-again",
            description: "That is the genitive form, we need nominative",
          },
          {
            text: "студентом",
            variant: "incorrect",
            description: "That is instrumental, not nominative",
          },
        ],
      },
      { type: "text", text: "." },
    ],
  },
  {
    id: 2,
    grammarPointId: 1,
    order: 1,
    ruParts: [
      { type: "text", text: "Что это? — Это " },
      {
        type: "answer",
        text: "книга",
        acceptableAnswers: [
          {
            text: "книгу",
            variant: "try-again",
            description: "That is accusative, we need nominative here",
          },
          {
            text: "книги",
            variant: "incorrect",
            description: "That is genitive, not nominative",
          },
        ],
      },
      { type: "text", text: "." },
    ],
    enParts: [
      { type: "text", text: "What is this? — This is a " },
      { type: "answer", text: "book" },
      { type: "text", text: "." },
    ],
  },
  {
    id: 3,
    grammarPointId: 1,
    order: 2,
    ruParts: [
      { type: "text", text: "Кто говорит? — " },
      {
        type: "answer",
        text: "Иван",
        acceptableAnswers: [
          {
            text: "Ваня",
            variant: "correct",
            description: "Diminutive of Ivan",
          },
          {
            text: "Ивана",
            variant: "try-again",
            description: "That is genitive, we need nominative",
          },
          {
            text: "Иваном",
            variant: "incorrect",
            description: "That is instrumental, not nominative",
          },
        ],
      },
      { type: "text", text: " говорит." },
    ],
    enParts: [
      { type: "text", text: "Who is speaking? — " },
      {
        type: "answer",
        text: "Ivan",
        acceptableAnswers: [
          {
            text: "John",
            variant: "correct",
            description: "English equivalent of Ivan",
          },
        ],
      },
      { type: "text", text: " is speaking." },
    ],
  },
  {
    id: 4,
    grammarPointId: 1,
    order: 3,
    ruParts: [
      { type: "text", text: "Кто здесь? — " },
      {
        type: "answer",
        text: "Мама",
        acceptableAnswers: [
          {
            text: "мать",
            variant: "correct",
            description: "More formal word for mother",
          },
          {
            text: "маму",
            variant: "try-again",
            description: "That is accusative, we need nominative",
          },
          {
            text: "маме",
            variant: "incorrect",
            description: "That is dative/prepositional, not nominative",
          },
        ],
      },
      { type: "text", text: " здесь." },
    ],
    enParts: [
      { type: "text", text: "Who is here? — " },
      {
        type: "answer",
        text: "Mother",
        acceptableAnswers: [{ text: "Mom", variant: "correct" }],
      },
      { type: "text", text: " is here." },
    ],
  },
  // ── GP 2: Genitive (Кого? Чего?) ────────────────────────────────
  {
    id: 5,
    grammarPointId: 2,
    order: 0,
    ruParts: [
      { type: "text", text: "У меня нет " },
      {
        type: "answer",
        text: "времени",
        acceptableAnswers: [
          {
            text: "время",
            variant: "try-again",
            description: "That is nominative, but after 'нет' we need genitive",
          },
          {
            text: "временем",
            variant: "incorrect",
            description: "That is instrumental, not genitive",
          },
        ],
      },
      { type: "text", text: "." },
    ],
    enParts: [
      { type: "text", text: "I don't have " },
      { type: "answer", text: "time" },
      { type: "text", text: "." },
    ],
  },
  {
    id: 6,
    grammarPointId: 2,
    order: 1,
    ruParts: [
      { type: "text", text: "Книга " },
      {
        type: "answer",
        text: "студента",
        acceptableAnswers: [
          {
            text: "студент",
            variant: "try-again",
            description:
              "That is nominative, we need genitive to show possession",
          },
          {
            text: "студенту",
            variant: "incorrect",
            description: "That is dative, not genitive",
          },
        ],
      },
      { type: "text", text: "." },
    ],
    enParts: [
      { type: "text", text: "The " },
      {
        type: "answer",
        text: "student's",
        acceptableAnswers: [{ text: "of the student", variant: "correct" }],
      },
      { type: "text", text: " book." },
    ],
  },
  {
    id: 7,
    grammarPointId: 2,
    order: 2,
    ruParts: [
      { type: "text", text: "Нет " },
      {
        type: "answer",
        text: "воды",
        acceptableAnswers: [
          {
            text: "вода",
            variant: "try-again",
            description: "That is nominative, but after 'нет' we need genitive",
          },
          {
            text: "водой",
            variant: "incorrect",
            description: "That is instrumental, not genitive",
          },
        ],
      },
      { type: "text", text: "." },
    ],
    enParts: [
      { type: "text", text: "There is no " },
      { type: "answer", text: "water" },
      { type: "text", text: "." },
    ],
  },
  {
    id: 8,
    grammarPointId: 2,
    order: 3,
    ruParts: [
      { type: "text", text: "Я боюсь " },
      {
        type: "answer",
        text: "собак",
        acceptableAnswers: [
          {
            text: "псов",
            variant: "correct",
            description: "Another word for dogs",
          },
          {
            text: "собаки",
            variant: "try-again",
            description: "That is nominative plural, we need genitive plural",
          },
          {
            text: "собаками",
            variant: "incorrect",
            description: "That is instrumental plural, not genitive",
          },
        ],
      },
      { type: "text", text: "." },
    ],
    enParts: [
      { type: "text", text: "I am afraid of " },
      { type: "answer", text: "dogs" },
      { type: "text", text: "." },
    ],
  },
  // ── GP 3: Dative (Кому? Чему?) ──────────────────────────────────
  {
    id: 9,
    grammarPointId: 3,
    order: 0,
    ruParts: [
      { type: "text", text: "Я даю книгу " },
      {
        type: "answer",
        text: "другу",
        acceptableAnswers: [
          {
            text: "приятелю",
            variant: "correct",
            description: "Another word for friend (dative)",
          },
          {
            text: "друг",
            variant: "try-again",
            description: "That is nominative, we need dative after 'даю'",
          },
          {
            text: "другом",
            variant: "incorrect",
            description: "That is instrumental, not dative",
          },
        ],
      },
      { type: "text", text: "." },
    ],
    enParts: [
      { type: "text", text: "I give the book to a " },
      {
        type: "answer",
        text: "friend",
        acceptableAnswers: [{ text: "pal", variant: "correct" }],
      },
      { type: "text", text: "." },
    ],
  },
  {
    id: 10,
    grammarPointId: 3,
    order: 1,
    ruParts: [
      { type: "text", text: "Он помогает " },
      {
        type: "answer",
        text: "маме",
        acceptableAnswers: [
          {
            text: "матери",
            variant: "correct",
            description: "This is the formal dative of 'мать'",
          },
          {
            text: "мама",
            variant: "try-again",
            description: "That is nominative, we need dative",
          },
          {
            text: "мамой",
            variant: "incorrect",
            description: "That is instrumental, not dative",
          },
        ],
      },
      { type: "text", text: "." },
    ],
    enParts: [
      { type: "text", text: "He helps his " },
      {
        type: "answer",
        text: "mother",
        acceptableAnswers: [{ text: "mom", variant: "correct" }],
      },
      { type: "text", text: "." },
    ],
  },
  {
    id: 11,
    grammarPointId: 3,
    order: 2,
    ruParts: [
      { type: "text", text: "Я пишу письмо " },
      {
        type: "answer",
        text: "брату",
        acceptableAnswers: [
          {
            text: "брат",
            variant: "try-again",
            description: "That is nominative, we need dative",
          },
          {
            text: "братом",
            variant: "incorrect",
            description: "That is instrumental, not dative",
          },
        ],
      },
      { type: "text", text: "." },
    ],
    enParts: [
      { type: "text", text: "I write a letter to my " },
      { type: "answer", text: "brother" },
      { type: "text", text: "." },
    ],
  },
  {
    id: 12,
    grammarPointId: 3,
    order: 3,
    ruParts: [
      { type: "text", text: "Это письмо " },
      {
        type: "answer",
        text: "учителю",
        acceptableAnswers: [
          {
            text: "преподавателю",
            variant: "correct",
            description: "Another word for teacher (dative)",
          },
          {
            text: "учитель",
            variant: "try-again",
            description: "That is nominative, we need dative",
          },
          {
            text: "учителем",
            variant: "incorrect",
            description: "That is instrumental, not dative",
          },
        ],
      },
      { type: "text", text: "." },
    ],
    enParts: [
      { type: "text", text: "This letter is for the " },
      {
        type: "answer",
        text: "teacher",
        acceptableAnswers: [{ text: "professor", variant: "correct" }],
      },
      { type: "text", text: "." },
    ],
  },
  // ── GP 4: Accusative (Кого? Что?) ───────────────────────────────
  {
    id: 13,
    grammarPointId: 4,
    order: 0,
    ruParts: [
      { type: "text", text: "Я вижу " },
      {
        type: "answer",
        text: "кота",
        acceptableAnswers: [
          {
            text: "кошку",
            variant: "correct",
            description: "Female cat (accusative)",
          },
          {
            text: "кот",
            variant: "try-again",
            description: "That is nominative, we need accusative",
          },
          {
            text: "коту",
            variant: "incorrect",
            description: "That is dative, not accusative",
          },
        ],
      },
      { type: "text", text: "." },
    ],
    enParts: [
      { type: "text", text: "I see a " },
      {
        type: "answer",
        text: "cat",
        acceptableAnswers: [{ text: "kitty", variant: "correct" }],
      },
      { type: "text", text: "." },
    ],
  },
  {
    id: 14,
    grammarPointId: 4,
    order: 1,
    ruParts: [
      { type: "text", text: "Я читаю " },
      {
        type: "answer",
        text: "книгу",
        acceptableAnswers: [
          {
            text: "книга",
            variant: "try-again",
            description: "That is nominative, we need accusative",
          },
          {
            text: "книгой",
            variant: "incorrect",
            description: "That is instrumental, not accusative",
          },
        ],
      },
      { type: "text", text: "." },
    ],
    enParts: [
      { type: "text", text: "I read a " },
      { type: "answer", text: "book" },
      { type: "text", text: "." },
    ],
  },
  {
    id: 15,
    grammarPointId: 4,
    order: 2,
    ruParts: [
      { type: "text", text: "Она любит " },
      {
        type: "answer",
        text: "музыку",
        acceptableAnswers: [
          {
            text: "музыка",
            variant: "try-again",
            description: "That is nominative, we need accusative",
          },
          {
            text: "музыкой",
            variant: "incorrect",
            description: "That is instrumental, not accusative",
          },
        ],
      },
      { type: "text", text: "." },
    ],
    enParts: [
      { type: "text", text: "She loves " },
      { type: "answer", text: "music" },
      { type: "text", text: "." },
    ],
  },
  {
    id: 16,
    grammarPointId: 4,
    order: 3,
    ruParts: [
      { type: "text", text: "Я вижу " },
      {
        type: "answer",
        text: "сестру",
        acceptableAnswers: [
          {
            text: "сестра",
            variant: "try-again",
            description: "That is nominative, we need accusative",
          },
          {
            text: "сестрой",
            variant: "incorrect",
            description: "That is instrumental, not accusative",
          },
        ],
      },
      { type: "text", text: "." },
    ],
    enParts: [
      { type: "text", text: "I see my " },
      { type: "answer", text: "sister" },
      { type: "text", text: "." },
    ],
  },
  // ── GP 5: Instrumental (Кем? Чем?) ──────────────────────────────
  {
    id: 17,
    grammarPointId: 5,
    order: 0,
    ruParts: [
      { type: "text", text: "Я пишу " },
      {
        type: "answer",
        text: "ручкой",
        acceptableAnswers: [
          {
            text: "авторучкой",
            variant: "correct",
            description: "Another word for pen (instrumental)",
          },
          {
            text: "пером",
            variant: "correct",
            description: "A quill/fountain pen (instrumental)",
          },
          {
            text: "ручка",
            variant: "try-again",
            description: "That is nominative, we need instrumental",
          },
          {
            text: "ручку",
            variant: "incorrect",
            description: "That is accusative, not instrumental",
          },
        ],
      },
      { type: "text", text: "." },
    ],
    enParts: [
      { type: "text", text: "I write with a " },
      {
        type: "answer",
        text: "pen",
        acceptableAnswers: [
          {
            text: "a pen",
            variant: "try-again",
            description: "No article needed with 'with a pen'",
          },
        ],
      },
      { type: "text", text: "." },
    ],
  },
  {
    id: 18,
    grammarPointId: 5,
    order: 1,
    ruParts: [
      { type: "text", text: "Он работает " },
      {
        type: "answer",
        text: "учителем",
        acceptableAnswers: [
          {
            text: "преподавателем",
            variant: "correct",
            description: "Another word for teacher (instrumental)",
          },
          {
            text: "учитель",
            variant: "try-again",
            description: "That is nominative, we need instrumental",
          },
          {
            text: "учителя",
            variant: "incorrect",
            description: "That is genitive, not instrumental",
          },
        ],
      },
      { type: "text", text: "." },
    ],
    enParts: [
      { type: "text", text: "He works as a " },
      {
        type: "answer",
        text: "teacher",
        acceptableAnswers: [
          {
            text: "a teacher",
            variant: "try-again",
            description: "No article needed here",
          },
        ],
      },
      { type: "text", text: "." },
    ],
  },
  {
    id: 19,
    grammarPointId: 5,
    order: 2,
    ruParts: [
      { type: "text", text: "Я путешествую " },
      {
        type: "answer",
        text: "поездом",
        acceptableAnswers: [
          {
            text: "на поезде",
            variant: "correct",
            description: "Alternative: on the train",
          },
          {
            text: "поезд",
            variant: "try-again",
            description: "That is nominative/accusative, we need instrumental",
          },
          {
            text: "поезда",
            variant: "incorrect",
            description: "That is genitive, not instrumental",
          },
        ],
      },
      { type: "text", text: "." },
    ],
    enParts: [
      { type: "text", text: "I travel by " },
      {
        type: "answer",
        text: "train",
        acceptableAnswers: [{ text: "on a train", variant: "correct" }],
      },
      { type: "text", text: "." },
    ],
  },
  {
    id: 20,
    grammarPointId: 5,
    order: 3,
    ruParts: [
      { type: "text", text: "Я интересуюсь " },
      {
        type: "answer",
        text: "искусством",
        acceptableAnswers: [
          {
            text: "искусство",
            variant: "try-again",
            description: "That is nominative/accusative, we need instrumental",
          },
          {
            text: "искусства",
            variant: "incorrect",
            description: "That is genitive, not instrumental",
          },
        ],
      },
      { type: "text", text: "." },
    ],
    enParts: [
      { type: "text", text: "I am interested in " },
      { type: "answer", text: "art" },
      { type: "text", text: "." },
    ],
  },
  // ── GP 6: Prepositional (О ком? О чём?) ─────────────────────────
  {
    id: 21,
    grammarPointId: 6,
    order: 0,
    ruParts: [
      { type: "text", text: "Я живу в " },
      {
        type: "answer",
        text: "доме",
        acceptableAnswers: [
          {
            text: "дом",
            variant: "try-again",
            description:
              "After 'в' we need prepositional, not nominative/accusative",
          },
          {
            text: "дома",
            variant: "incorrect",
            description:
              "That is genitive or 'at home', not prepositional of 'дом'",
          },
        ],
      },
      { type: "text", text: "." },
    ],
    enParts: [
      { type: "text", text: "I live in a " },
      { type: "answer", text: "house" },
      { type: "text", text: "." },
    ],
  },
  {
    id: 22,
    grammarPointId: 6,
    order: 1,
    ruParts: [
      { type: "text", text: "Он говорит о " },
      {
        type: "answer",
        text: "фильме",
        acceptableAnswers: [
          {
            text: "кино",
            variant: "correct",
            description: "Another word for film (prepositional)",
          },
          {
            text: "фильм",
            variant: "try-again",
            description:
              "After 'о' we need prepositional, not nominative/accusative",
          },
          {
            text: "фильма",
            variant: "incorrect",
            description: "That is genitive, not prepositional",
          },
        ],
      },
      { type: "text", text: "." },
    ],
    enParts: [
      { type: "text", text: "He is talking about the " },
      {
        type: "answer",
        text: "film",
        acceptableAnswers: [{ text: "movie", variant: "correct" }],
      },
      { type: "text", text: "." },
    ],
  },
  {
    id: 23,
    grammarPointId: 6,
    order: 2,
    ruParts: [
      { type: "text", text: "Книга на " },
      {
        type: "answer",
        text: "столе",
        acceptableAnswers: [
          {
            text: "стол",
            variant: "try-again",
            description:
              "After 'на' we need prepositional, not nominative/accusative",
          },
          {
            text: "стола",
            variant: "incorrect",
            description: "That is genitive, not prepositional",
          },
        ],
      },
      { type: "text", text: "." },
    ],
    enParts: [
      { type: "text", text: "The book is on the " },
      { type: "answer", text: "table" },
      { type: "text", text: "." },
    ],
  },
  {
    id: 24,
    grammarPointId: 6,
    order: 3,
    ruParts: [
      { type: "text", text: "Мы говорим об " },
      {
        type: "answer",
        text: "уроке",
        acceptableAnswers: [
          {
            text: "занятии",
            variant: "correct",
            description: "Another word for lesson/class (prepositional)",
          },
          {
            text: "урок",
            variant: "try-again",
            description:
              "After 'об' we need prepositional, not nominative/accusative",
          },
          {
            text: "урока",
            variant: "incorrect",
            description: "That is genitive, not prepositional",
          },
        ],
      },
      { type: "text", text: "." },
    ],
    enParts: [
      { type: "text", text: "We are talking about the " },
      {
        type: "answer",
        text: "lesson",
        acceptableAnswers: [{ text: "class", variant: "correct" }],
      },
      { type: "text", text: "." },
    ],
  },
  // ── GP 7: Present Simple ────────────────────────────────────────
  {
    id: 25,
    grammarPointId: 7,
    order: 0,
    ruParts: [
      { type: "text", text: "Я " },
      {
        type: "answer",
        text: "читаю",
        acceptableAnswers: [
          {
            text: "читаешь",
            variant: "try-again",
            description:
              "That is 'you read' (2nd person), we need 1st person 'я читаю'",
          },
          {
            text: "читал",
            variant: "incorrect",
            description: "That is past tense, we need present tense",
          },
        ],
      },
      { type: "text", text: " книгу." },
    ],
    enParts: [
      { type: "text", text: "I " },
      {
        type: "answer",
        text: "read",
        acceptableAnswers: [
          {
            text: "am reading",
            variant: "correct",
            description: "Present continuous also works",
          },
        ],
      },
      { type: "text", text: " a book." },
    ],
  },
  {
    id: 26,
    grammarPointId: 7,
    order: 1,
    ruParts: [
      { type: "text", text: "Он " },
      {
        type: "answer",
        text: "говорит",
        acceptableAnswers: [
          {
            text: "разговаривает",
            variant: "correct",
            description: "Another word for speaks/talks (3rd person present)",
          },
          {
            text: "говорю",
            variant: "try-again",
            description: "That is 'I speak', we need 3rd person 'он говорит'",
          },
          {
            text: "говорил",
            variant: "incorrect",
            description: "That is past tense, we need present",
          },
        ],
      },
      { type: "text", text: " по-русски." },
    ],
    enParts: [
      { type: "text", text: "He " },
      {
        type: "answer",
        text: "speaks",
        acceptableAnswers: [{ text: "talks", variant: "correct" }],
      },
      { type: "text", text: " Russian." },
    ],
  },
  {
    id: 27,
    grammarPointId: 7,
    order: 2,
    ruParts: [
      { type: "text", text: "Они " },
      {
        type: "answer",
        text: "живут",
        acceptableAnswers: [
          {
            text: "проживают",
            variant: "correct",
            description: "Another word for live/reside (3rd person plural)",
          },
          {
            text: "живёте",
            variant: "try-again",
            description: "That is 'you (plural) live', we need 'they live'",
          },
          {
            text: "жили",
            variant: "incorrect",
            description: "That is past tense, we need present",
          },
        ],
      },
      { type: "text", text: " в городе." },
    ],
    enParts: [
      { type: "text", text: "They " },
      { type: "answer", text: "live" },
      { type: "text", text: " in the city." },
    ],
  },
  {
    id: 28,
    grammarPointId: 7,
    order: 3,
    ruParts: [
      { type: "text", text: "Мы " },
      {
        type: "answer",
        text: "учимся",
        acceptableAnswers: [
          {
            text: "занимаемся",
            variant: "correct",
            description: "Another word for study/do (1st person plural)",
          },
          {
            text: "учитесь",
            variant: "try-again",
            description: "That is 'you (plural) study', we need 'we study'",
          },
          {
            text: "учились",
            variant: "incorrect",
            description: "That is past tense, we need present",
          },
        ],
      },
      { type: "text", text: " в школе." },
    ],
    enParts: [
      { type: "text", text: "We " },
      {
        type: "answer",
        text: "study",
        acceptableAnswers: [{ text: "learn", variant: "correct" }],
      },
      { type: "text", text: " at school." },
    ],
  },
  // ── GP 8: Past Simple ───────────────────────────────────────────
  {
    id: 29,
    grammarPointId: 8,
    order: 0,
    ruParts: [
      { type: "text", text: "Я " },
      {
        type: "answer",
        text: "писал",
        acceptableAnswers: [
          {
            text: "написал",
            variant: "correct",
            description: "Perfective past of 'to write' — also correct",
          },
          {
            text: "писала",
            variant: "try-again",
            description: "That is feminine form, but 'я' here is masculine",
          },
          {
            text: "пишет",
            variant: "incorrect",
            description: "That is present tense, not past",
          },
        ],
      },
      { type: "text", text: " письмо." },
    ],
    enParts: [
      { type: "text", text: "I " },
      {
        type: "answer",
        text: "wrote",
        acceptableAnswers: [
          {
            text: "was writing",
            variant: "correct",
            description: "Past continuous also works",
          },
        ],
      },
      { type: "text", text: " a letter." },
    ],
  },
  {
    id: 30,
    grammarPointId: 8,
    order: 1,
    ruParts: [
      { type: "text", text: "Она " },
      {
        type: "answer",
        text: "была",
        acceptableAnswers: [
          {
            text: "находилась",
            variant: "correct",
            description: "Another word for was located (feminine past)",
          },
          {
            text: "был",
            variant: "try-again",
            description: "That is masculine form, but 'она' is feminine",
          },
          {
            text: "есть",
            variant: "incorrect",
            description: "That is present tense, not past",
          },
        ],
      },
      { type: "text", text: " дома." },
    ],
    enParts: [
      { type: "text", text: "She " },
      { type: "answer", text: "was" },
      { type: "text", text: " at home." },
    ],
  },
  {
    id: 31,
    grammarPointId: 8,
    order: 2,
    ruParts: [
      { type: "text", text: "Они " },
      {
        type: "answer",
        text: "жили",
        acceptableAnswers: [
          {
            text: "проживали",
            variant: "correct",
            description: "Another word for lived/resided (plural past)",
          },
          {
            text: "живут",
            variant: "try-again",
            description: "That is present tense, we need past",
          },
          {
            text: "жил",
            variant: "incorrect",
            description: "That is masculine singular, not plural",
          },
        ],
      },
      { type: "text", text: " в Москве." },
    ],
    enParts: [
      { type: "text", text: "They " },
      {
        type: "answer",
        text: "lived",
        acceptableAnswers: [{ text: "used to live", variant: "correct" }],
      },
      { type: "text", text: " in Moscow." },
    ],
  },
  {
    id: 32,
    grammarPointId: 8,
    order: 3,
    ruParts: [
      { type: "text", text: "Мы " },
      {
        type: "answer",
        text: "работали",
        acceptableAnswers: [
          {
            text: "работают",
            variant: "try-again",
            description: "That is present tense, we need past",
          },
          {
            text: "работал",
            variant: "incorrect",
            description: "That is masculine singular, but 'мы' needs plural",
          },
        ],
      },
      { type: "text", text: " вчера." },
    ],
    enParts: [
      { type: "text", text: "We " },
      {
        type: "answer",
        text: "worked",
        acceptableAnswers: [{ text: "used to work", variant: "correct" }],
      },
      { type: "text", text: " yesterday." },
    ],
  },
  // ── GP 9: Future Simple ─────────────────────────────────────────
  {
    id: 33,
    grammarPointId: 9,
    order: 0,
    ruParts: [
      { type: "text", text: "Завтра я " },
      {
        type: "answer",
        text: "буду читать",
        acceptableAnswers: [
          {
            text: "прочитаю",
            variant: "correct",
            description: "Perfective future — 'I will (finish) reading'",
          },
          {
            text: "читаю",
            variant: "try-again",
            description: "That is present tense, not future",
          },
          {
            text: "читал",
            variant: "incorrect",
            description: "That is past tense, not future",
          },
        ],
      },
      { type: "text", text: " книгу." },
    ],
    enParts: [
      { type: "text", text: "Tomorrow I " },
      {
        type: "answer",
        text: "will read",
        acceptableAnswers: [
          { text: "'ll read", variant: "correct" },
          { text: "am going to read", variant: "correct" },
        ],
      },
      { type: "text", text: " a book." },
    ],
  },
  {
    id: 34,
    grammarPointId: 9,
    order: 1,
    ruParts: [
      { type: "text", text: "Они " },
      {
        type: "answer",
        text: "будут жить",
        acceptableAnswers: [
          {
            text: "проживут",
            variant: "correct",
            description: "Perfective future — 'they will reside'",
          },
          {
            text: "живут",
            variant: "try-again",
            description: "That is present tense, not future",
          },
          {
            text: "жили",
            variant: "incorrect",
            description: "That is past tense, not future",
          },
        ],
      },
      { type: "text", text: " здесь." },
    ],
    enParts: [
      { type: "text", text: "They " },
      {
        type: "answer",
        text: "will live",
        acceptableAnswers: [{ text: "'ll live", variant: "correct" }],
      },
      { type: "text", text: " here." },
    ],
  },
  {
    id: 35,
    grammarPointId: 9,
    order: 2,
    ruParts: [
      { type: "text", text: "Он " },
      {
        type: "answer",
        text: "напишет",
        acceptableAnswers: [
          {
            text: "будет писать",
            variant: "correct",
            description: "Imperfective future — 'he will be writing'",
          },
          {
            text: "пишет",
            variant: "try-again",
            description: "That is present tense, not future",
          },
          {
            text: "писал",
            variant: "incorrect",
            description: "That is past tense, not future",
          },
        ],
      },
      { type: "text", text: " письмо." },
    ],
    enParts: [
      { type: "text", text: "He " },
      {
        type: "answer",
        text: "will write",
        acceptableAnswers: [{ text: "'ll write", variant: "correct" }],
      },
      { type: "text", text: " a letter." },
    ],
  },
  {
    id: 36,
    grammarPointId: 9,
    order: 3,
    ruParts: [
      { type: "text", text: "Я " },
      {
        type: "answer",
        text: "прочитаю",
        acceptableAnswers: [
          {
            text: "буду читать",
            variant: "correct",
            description: "Imperfective future — 'I will be reading'",
          },
          {
            text: "читаю",
            variant: "try-again",
            description: "That is present tense, not future",
          },
          {
            text: "читал",
            variant: "incorrect",
            description: "That is past tense, not future",
          },
        ],
      },
      { type: "text", text: " эту книгу." },
    ],
    enParts: [
      { type: "text", text: "I " },
      {
        type: "answer",
        text: "will read",
        acceptableAnswers: [{ text: "'ll read", variant: "correct" }],
      },
      { type: "text", text: " this book." },
    ],
  },
  // ── GP 10: Aspect ───────────────────────────────────────────────
  {
    id: 37,
    grammarPointId: 10,
    order: 0,
    ruParts: [
      { type: "text", text: "Я (сейчас) " },
      {
        type: "answer",
        text: "пишу",
        acceptableAnswers: [
          {
            text: "напишу",
            variant: "try-again",
            description:
              "That is perfective future, but we need imperfective present for 'now'",
          },
          {
            text: "писал",
            variant: "incorrect",
            description: "That is past tense, not present",
          },
        ],
      },
      { type: "text", text: " письмо." },
    ],
    enParts: [
      { type: "text", text: "I (now) " },
      {
        type: "answer",
        text: "am writing",
        acceptableAnswers: [
          {
            text: "write",
            variant: "correct",
            description: "Simple present also works",
          },
        ],
      },
      { type: "text", text: " a letter." },
    ],
  },
  {
    id: 38,
    grammarPointId: 10,
    order: 1,
    ruParts: [
      { type: "text", text: "Я уже " },
      {
        type: "answer",
        text: "написал",
        acceptableAnswers: [
          {
            text: "писал",
            variant: "try-again",
            description:
              "Imperfective — 'I was writing' but we need completed action",
          },
          {
            text: "пишет",
            variant: "incorrect",
            description: "That is present tense, not past",
          },
        ],
      },
      { type: "text", text: " письмо." },
    ],
    enParts: [
      { type: "text", text: "I have already " },
      {
        type: "answer",
        text: "written",
        acceptableAnswers: [{ text: "finished", variant: "correct" }],
      },
      { type: "text", text: " the letter." },
    ],
  },
  {
    id: 39,
    grammarPointId: 10,
    order: 2,
    ruParts: [
      { type: "text", text: "Я (весь вечер) " },
      {
        type: "answer",
        text: "читал",
        acceptableAnswers: [
          {
            text: "прочитал",
            variant: "try-again",
            description:
              "Perfective — but 'all evening' implies ongoing process, use imperfective",
          },
          {
            text: "читает",
            variant: "incorrect",
            description: "That is present tense, not past",
          },
        ],
      },
      { type: "text", text: " книгу." },
    ],
    enParts: [
      { type: "text", text: "I (all evening) " },
      {
        type: "answer",
        text: "was reading",
        acceptableAnswers: [
          {
            text: "read",
            variant: "correct",
            description: "Simple past works too",
          },
        ],
      },
      { type: "text", text: " a book." },
    ],
  },
  {
    id: 40,
    grammarPointId: 10,
    order: 3,
    ruParts: [
      { type: "text", text: "Я наконец " },
      { type: "answer", text: "прочитал" },
      { type: "text", text: " эту книгу." },
    ],
    enParts: [
      { type: "text", text: "I finally " },
      { type: "answer", text: "finished reading" },
      { type: "text", text: " this book." },
    ],
  },
];

const exercisesData: (typeof exercisesTmp.$inferInsert)[] = exercisesDef.map(
  (e) => ({
    id: e.id,
    grammarPointId: e.grammarPointId,
    order: e.order,
    hide: false,
  }),
);

const exercisePartsData: (typeof exercisePartsTmp.$inferInsert)[] = [];

for (const ex of exercisesDef) {
  for (const [parts, language] of [
    [ex.ruParts, "ru"],
    [ex.enParts, "en"],
  ] as const) {
    for (let i = 0; i < parts.length; i++) {
      exercisePartsData.push({
        exerciseId: ex.id,
        order: i,
        type: parts[i].type,
        text: parts[i].text,
        language,
      });
    }
  }
}

const seed = async () => {
  try {
    console.log("🌱 Starting database seed...");
    console.log("Cleaning existing data...");
    await db.delete(acceptableAnswersTmp);
    await db.delete(exercisePartsTmp);
    await db.delete(exercisesTmp);
    await db.delete(grammarPointsTmp);
    console.log("✅ Cleaned existing data.");

    console.log("Inserting grammar points...");
    await db.insert(grammarPointsTmp).values(grammarPointsData);
    console.log("✅ Inserted 10 grammar points");

    console.log("Inserting exercises...");
    await db.insert(exercisesTmp).values(exercisesData);
    console.log("✅ Inserted 40 exercises");

    console.log("Inserting exercise parts...");
    const insertedParts = await db
      .insert(exercisePartsTmp)
      .values(exercisePartsData)
      .returning({
        id: exercisePartsTmp.id,
        exerciseId: exercisePartsTmp.exerciseId,
        order: exercisePartsTmp.order,
        type: exercisePartsTmp.type,
        text: exercisePartsTmp.text,
        language: exercisePartsTmp.language,
      });
    console.log(`✅ Inserted ${insertedParts.length} exercise parts`);

    const answerParts = insertedParts.filter((p) => p.type === "answer");
    const newAcceptableAnswers: (typeof acceptableAnswersTmp.$inferInsert)[] =
      [];

    for (const p of answerParts) {
      const ex = exercisesDef.find((e) => e.id === p.exerciseId);
      if (!ex) continue;

      const langParts = p.language === "ru" ? ex.ruParts : ex.enParts;
      const partDef = langParts[p.order];
      if (partDef?.type !== "answer") continue;

      if (partDef?.acceptableAnswers) {
        for (const def of partDef.acceptableAnswers) {
          newAcceptableAnswers.push({
            answerId: p.id,
            text: def.text,
            variant: def.variant,
            description: def.description,
          });
        }
      }
    }

    console.log("Inserting acceptable answers...");
    await db.insert(acceptableAnswersTmp).values(newAcceptableAnswers);
    console.log(
      `✅ Inserted ${newAcceptableAnswers.length} acceptable answers`,
    );

    console.log("Syncing identity sequences...");
    for (const [tableName, table] of [
      ["tmp.grammar_point_tmp", grammarPointsTmp],
      ["tmp.exercise_tmp", exercisesTmp],
    ] as const) {
      await db.execute(sql`
        SELECT setval(
          pg_get_serial_sequence(${tableName}, 'id'),
          (SELECT COALESCE(MAX(id), 1) FROM ${table})
        )
      `);
    }

    console.log("Seed completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
};

seed();
