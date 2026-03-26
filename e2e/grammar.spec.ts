import { test, expect } from "@playwright/test";

const firstGrammarPointTitle =
  "Кто ты? Кто я? Личные местоимения Personal pronouns";

test("Grammar page loads", async ({ page }) => {
  await page.goto("grammar/");
  const a1 = page.getByRole("heading", { name: "A1" });
  await expect(a1).toBeVisible();
  const firstGrammarPoint = page.getByRole("link", {
    name: firstGrammarPointTitle,
  });
  await expect(firstGrammarPoint).toBeVisible();

  const a2 = page.getByRole("heading", { name: "A2" });
  await expect(a2).toBeVisible();
});

test("Grammar point loads", async ({ page }) => {
  await page.goto("grammar/");
  const firstGrammarPoint = page.getByRole("link", {
    name: firstGrammarPointTitle,
  });
  await firstGrammarPoint.click();
  for (const button of await page
    .getByRole("button", { name: "Show translations" })
    .all()) {
    await button.click();
  }
  await expect(page.getByRole("main")).toMatchAriaSnapshot();
});

const answers = new Map([
  ["I am a journalist.", { correct: "Я", hasError: false }],
  ["You are a man.", { correct: "Ты", hasError: true }],
  ["She is not Japanese.", { correct: "Она", hasError: false }],
  ["He is an engineer.", { correct: "Он", hasError: false }],
  ["They live here.", { correct: "Они", hasError: true }],
  [
    "Mom is a doctor. She works in a hospital.",
    { correct: "Она", hasError: false },
  ],
  ["I like this man. He is handsome.", { correct: "Он", hasError: false }],
  [
    "My family and I live in Russia. We are Russians.",
    { correct: "Мы", hasError: false },
  ],
  ["Where do you usually walk?", { correct: "Вы", hasError: false }],
  [
    "“Do you know these people?” “Yes, they are my friends.”",
    { correct: "Они", hasError: false },
  ],
  ["I am riding on a bus.", { correct: "Я", hasError: false }],
  ["We like eating pizza.", { correct: "Мы", hasError: false }],
]);

test("Practice grammar point", async ({ page }) => {
  await page.goto("grammar/");
  const firstGrammarPoint = page.getByRole("link", {
    name: firstGrammarPointTitle,
  });
  await firstGrammarPoint.click();
  const practiceButton = page.getByRole("button", { name: "Practice" });
  await practiceButton.click();

  const madeMistake = new Set<string>();

  for (
    let i = 0;
    i <
    answers.size +
      Array.from(answers.values()).filter((a) => a.hasError).length;
    i++
  ) {
    const question = await page
      .getByTestId("exercise-description")
      .textContent();
    const answer = answers.get(question?.trim() ?? "");
    if (!answer) {
      throw new Error(`Unknown question: ${question}`);
    }
    const shouldMakeMistake =
      answer.hasError && !madeMistake.has(question ?? "");

    if (shouldMakeMistake) {
      await page.getByRole("textbox").fill("Ошибка");
      madeMistake.add(question ?? "");
    } else {
      await page.getByRole("textbox").fill(answer.correct);
    }

    await page.getByRole("button", { name: "Send" }).click();
    const expectCorrect = shouldMakeMistake ? "❌" : "✅";
    await expect(page.getByRole("paragraph")).toContainText(expectCorrect);
    await page.getByRole("button", { name: "Send" }).click();
  }
  await expect(page.getByRole("main")).toContainText("Correct: 10Incorrect: 2");
  await expect(page.getByRole("main")).toContainText("Ошибка");
});
