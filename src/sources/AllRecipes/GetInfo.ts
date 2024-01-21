import { getHtmlRoot } from "@/functions/Utils";
import { Err, Ok, Result } from "@/types/Results";
import { HTMLElement } from "node-html-parser";
import { FetchedAllRecipes } from "./Type";

function getScripts(root: HTMLElement): string[] {
	return root
		.getElementsByTagName("script")
		.map((script) => script.innerHTML);
}

function getDescription(root: HTMLElement): string {
	const description = root
		.querySelector("#article-subheading_1-0")!
		.innerText.trim();

	return description;
}

export async function fetchAllRecipesInfo(
	url: string,
): Promise<Result<FetchedAllRecipes, string>> {
	const root = await getHtmlRoot(url);

	if (root.some == false) {
		return Err("Recipe not found");
	}

	const scripts = getScripts(root.value);
	const recipeText = scripts.find((script) => script.includes("@context"));
	const description = getDescription(root.value);

	if (recipeText == undefined) {
		return Err("No recipe found");
	}

	let fetched: FetchedAllRecipes = JSON.parse(recipeText)[0];
	fetched.description = description;

	return Ok(fetched);
}
