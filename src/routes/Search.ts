import { AllRecipes } from "@/sources/AllRecipes/AllRecipes";
import { Err, Ok } from "@/types/Results";
import { Request, Response } from "express";

export default async function (req: Request, res: Response) {
	const query = req.query;

	if (query == undefined) {
		return res.json(Err("No query provided"));
	}

	const recipeQuery = req.query.q as string;
	let pageQuery = req.query.page as any;

	if (recipeQuery == undefined) {
		return res.json(Err("No recipe query provided"));
	}

	try {
		parseInt(pageQuery);
	} catch {
		return res.json(Err("Invalid page number"));
	}

	if (pageQuery == undefined) {
		pageQuery = 0;
	}

	const searches = await AllRecipes.GetSearches(recipeQuery, pageQuery);

	if (!searches.ok) {
		return res.json(Err(searches.error));
	}

	return res.json(Ok(searches.value));
}
