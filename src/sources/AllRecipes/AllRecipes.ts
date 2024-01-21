import { RecipeInfo, RecipeStep } from "@/sources/RecipeInfo";
import { allRecipesSearch } from "./Fetch";
import { fetchAllRecipesInfo } from "./GetInfo";
import { FetchedAllRecipes } from "./Type";

function ToRecipeInfo(fetched: FetchedAllRecipes): RecipeInfo {
	let steps: RecipeStep[] = [];

	fetched.recipeInstructions.forEach((instruction) => {
		steps.push({
			text: instruction.text,
			images:
				instruction.image?.map((image) => {
					return {
						url: image.url,
					};
				}) || [],
		});
	});

	let nutrition = fetched.nutrition && {
		calories: fetched.nutrition.calories,
		fatContent: fetched.nutrition.fatContent,
		carbohydrateContent: fetched.nutrition.carbohydrateContent,
		proteinContent: fetched.nutrition.proteinContent,
	};

	let video = fetched.video && {
		url: fetched.video.contentUrl,
		description: fetched.video.description,
		duration: fetched.video.duration,
		uploadDate: fetched.video.uploadDate,
	};

	let rating = {
		value: parseFloat(fetched.aggregateRating.ratingValue),
		count: parseInt(fetched.aggregateRating.ratingCount),
	};

	const recipeInfo: RecipeInfo = {
		headline: fetched.headline,
		description: fetched.description,
		rating: rating,
		cookTime: fetched.cookTime,
		prepTime: fetched.prepTime,
		recipeYield: fetched.recipeYield[0],
		nutrition: nutrition,
		ingredients: fetched.recipeIngredient,
		author: fetched.author[0].name,
		totalTime: fetched.totalTime,
		image: {
			url: fetched.image.url,
		},
		steps: steps,
		video: video,
		dateModified: fetched.dateModified,
	};

	return recipeInfo;
}

export class AllRecipes {
	public static FormatUrl(id: string, rawTitle: string) {
		return "https://www.allrecipes.com/recipe/" + id + "/" + rawTitle;
	}

	public static GetSearches(query: string, page: number) {
		return allRecipesSearch(query, page);
	}

	public static FetchInfo(url: string) {
		return fetchAllRecipesInfo(url);
	}

	public static ToRecipeInfo(fetched: FetchedAllRecipes): RecipeInfo {
		return ToRecipeInfo(fetched);
	}
}
