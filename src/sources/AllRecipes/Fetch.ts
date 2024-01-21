import { getHtmlRoot } from "@/functions/Utils";
import { RecipeSearch } from "@/sources/RecipeSearch";
import { Err, Ok, Result } from "@/types/Results";
import { HTMLElement } from "node-html-parser";

function getImageUrl(recipeElement: HTMLElement) {
	const image = recipeElement
		.getElementsByTagName("img")[0]
		.getAttribute("data-src")!;

	return image;
}

function getId(recipeElement: HTMLElement): number {
	const hrefSplit = recipeElement.getAttribute("href")!.split("/");
	const id = hrefSplit[4];

	return parseInt(id);
}

function getRawTitle(recipeElement: HTMLElement): string {
	const hrefSplit = recipeElement.getAttribute("href")!.split("/");
	const rawTitle = hrefSplit[5];

	return rawTitle;
}

function getTitle(recipeElement: HTMLElement): string {
	const title = (
		recipeElement.querySelector(".card__title-text") as HTMLElement
	).innerText;

	return title;
}

function getRating(recipeElement: HTMLElement): number {
	const ratingStars: HTMLElement[] = recipeElement.querySelectorAll("*");

	let rating = 0;
	Object.values(ratingStars).forEach(function (star) {
		const classList = star.classList;

		if (classList.contains("icon-star")) {
			rating += 1;
		} else if (classList.contains("icon-star-half")) {
			rating += 0.5;
		}
	});

	return rating;
}

function getRatingCount(recipeElement: HTMLElement): Result<number, string> {
	const ratingElement = recipeElement.querySelector(
		".recipe-card-meta__rating-count-number",
	);

	if (ratingElement == undefined) {
		return Err("Rating count not found");
	}

	const ratingCount = ratingElement.innerText.replace(",", "");
	return Ok(parseInt(ratingCount));
}

function parseRecipeElement(
	recipeElement: HTMLElement,
): Result<RecipeSearch, string> {
	const image = getImageUrl(recipeElement);
	const rawTitle = getRawTitle(recipeElement);
	const id = getId(recipeElement);
	const title = getTitle(recipeElement);
	const rating = getRating(recipeElement);
	const ratingCount = getRatingCount(recipeElement);

	if (!ratingCount.ok) {
		return Err(ratingCount.error);
	}

	const recipe: RecipeSearch = {
		image: image,
		title: title,
		id: id,
		rawTitle: rawTitle,
		rating: rating,
		ratingCount: ratingCount.value,
	};

	return Ok(recipe);
}

export async function allRecipesSearch(
	query: string,
	page: number,
): Promise<Result<RecipeSearch[], string>> {
	const offset = page * 24;
	const root = await getHtmlRoot(
		`https://www.allrecipes.com/search?q=${query}&offset=${offset}`,
	);

	if (root.some == false) {
		return Err("Recipe not found");
	}

	let recipeElements = root.value.querySelectorAll(".mntl-card-list-items");
	let recipes: Result<RecipeSearch, string>[] = recipeElements.map((recipe) =>
		parseRecipeElement(recipe),
	);

	let okRecipes = recipes.filter((recipe) => recipe.ok);
	let recipesSearch: RecipeSearch[] = okRecipes.map(
		(recipe: any) => recipe.value,
	);

	return Ok(recipesSearch);
}
