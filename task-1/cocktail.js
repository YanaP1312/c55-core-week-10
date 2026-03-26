// API documentation: https://www.thecocktaildb.com/api.php

import path from "path";
import fsPromises from "node:fs/promises";

const BASE_URL = "https://www.thecocktaildb.com/api/json/v1/1";

// Add helper functions as needed here

function formatHeading(drink) {
  return `## ${drink.strDrink}`;
}

function formatThumbnail(drink) {
  return `![${drink.strDrink}](${drink.strDrinkThumb}/medium)`;
}

function formatCategory(drink) {
  return `**Category**: ${drink.strCategory}`;
}

function formatAlcoholic(drink) {
  return drink.strAlcoholic === "Alcoholic"
    ? "**Alcoholic**: Yes"
    : "**Alcoholic**: No";
}

function formatInstructions(drink) {
  return `### Instructions\n\n${drink.strInstructions}`;
}

function formatServeIn(drink) {
  return `Serve in: ${drink.strGlass}`;
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

function generateMarkdownContent(data) {
  return data.drinks
    .map((drink) => {
      const ingredients = cocktailIngredients(drink)
        .map((ingredient) => `- ${ingredient}`)
        .join("\n");

      return [
        formatHeading(drink),
        "",
        formatThumbnail(drink),
        "",
        formatCategory(drink),
        "",
        formatAlcoholic(drink),
        "",
        "### Ingredients",
        "",
        ingredients,
        "",
        formatInstructions(drink),
        "",
        formatServeIn(drink),
        "",
      ].join("\n");
    })
    .join("\n");
}

async function fetchCocktailData(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return await response.json();
}

function validateCocktailData(data) {
  if (!data.drinks) {
    throw new Error("No cocktails found with that name.");
  }
}

async function saveMarkdown(path, content) {
  await fsPromises.writeFile(path, content);
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
    const data = await fetchCocktailData(url);
    validateCocktailData(data);

    const markdown = `# Cocktail Recipes\n\n${generateMarkdownContent(data)}`;
    await saveMarkdown(outPath, markdown);
  } catch (error) {
    console.error(`Something went wrong: ${error.message}`);
  }
}

// Do not change the code below
if (!process.env.VITEST) {
  main();
}
