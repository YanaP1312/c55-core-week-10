// API documentation: https://www.thecocktaildb.com/api.php

import path from "path";
import fsPromises from "node:fs/promises";

const BASE_URL = "https://www.thecocktaildb.com/api/json/v1/1";

// Add helper functions as needed here

function generateMarkdownContent(data) {
  const cocktails = data.drinks.map((drink) => {
    const heading = `## ${drink.strDrink}`;

    const thumbnailImage = `![${drink.strDrink}](${drink.strDrinkThumb}/medium)`;

    const category = `**Category**: ${drink.strCategory}`;

    const idAlcoholic =
      drink.strAlcoholic === "Alcoholic"
        ? "**Alcoholic**: Yes"
        : "**Alcoholic**: No";

    const listOfIngredients = cocktailIngredients(drink)
      .map((ingredient) => `- ${ingredient}`)
      .join("\n");

    const instructions = `### Instructions\n\n${drink.strInstructions}`;

    const serveIn = `Serve in: ${drink.strGlass}`;

    const drinkOutput = `${heading}\n\n${thumbnailImage}\n\n${category}\n\n${idAlcoholic}\n\n### Ingredients\n\n${listOfIngredients}\n\n${instructions}\n\n${serveIn}\n\n`;

    return drinkOutput;
  });

  return cocktails.join("\n");
}

function cocktailIngredients(drink) {
  if (!drink) return;

  let ingredients = [];

  for (let i = 1; i <= 15; i++) {
    const ingredient = drink[`strIngredient${i}`];
    const measure = drink[`strMeasure${i}`];

    if (!ingredient) break;

    ingredients.push(`${measure || ""}${ingredient}`.trim());
  }

  return ingredients;
}

export async function main() {
  if (process.argv.length < 3) {
    console.error("Please provide a cocktail name as a command line argument.");
    return;
  }

  const cocktailName = process.argv[2];
  const url = `${BASE_URL}/search.php?s=${cocktailName}`;

  const __dirname = import.meta.dirname;
  const outPath = path.join(__dirname, `./output/${cocktailName}.md`);

  try {
    // 1. Fetch data from the API at the given URL
    // 2. Generate markdown content to match the examples
    // 3. Write the generated content to a markdown file as given by outPath

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();

    if (!data.drinks) {
      console.error("No cocktails found with that name.");
      return;
    }

    const markdownContent = `# Cocktail Recipes\n\n${generateMarkdownContent(data)}`;

    await fsPromises.writeFile(outPath, markdownContent);
  } catch (error) {
    console.error(`Something went wrong: ${error.message}`);
  }
}

// Do not change the code below
if (!process.env.VITEST) {
  main();
}
