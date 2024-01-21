import { AllRecipes } from "@/sources/AllRecipes/AllRecipes";
import { Err, Ok } from "@/types/Results";
import { Request, Response } from "express";

export default async function (req: Request, res: Response) {
	let id = req.params.id;
	let rawTitle = req.params.rawTitle;

	if (id == undefined) {
		return res.json(Err("No id provided"));
	}

	if (rawTitle == undefined) {
		return res.json(Err("No raw title provided"));
	}

	const recipeLink = AllRecipes.FormatUrl(id, rawTitle);
	const recipeResult = await AllRecipes.FetchInfo(recipeLink);

	if (!recipeResult.ok) {
		return res.json(Err(recipeResult.error));
	}

	const recipeInfo = AllRecipes.ToRecipeInfo(recipeResult.value);

	res.json(Ok(recipeInfo));
}
