export type RecipeInfo = {
	headline: string;
	description: string;
	rating: RecipeRating;
	totalTime: string;
	cookTime: string;
	prepTime: string;
	recipeYield: string;
	author: string;
	nutrition?: RecipeNutrition;
	ingredients: string[];
	image: RecipeImage;
	steps: RecipeStep[];
	video?: RecipeVideo;
	dateModified: Date;
};

export type RecipeStep = {
	text: string;
	images?: RecipeImage[];
};

export type RecipeImage = {
	url: string;
};

type RecipeVideo = {
	url: string;
	description: string;
	duration: string;
	uploadDate: Date;
};

type RecipeNutrition = {
	calories?: string;
	fatContent?: string;
	carbohydrateContent?: string;
	proteinContent?: string;
};

type RecipeRating = {
	value: number;
	count: number;
};
