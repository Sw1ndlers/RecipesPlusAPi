export type FetchedAllRecipes = {
	"@context": string;
	"@type": string[];
	headline: string;
	datePublished: Date;
	dateModified: Date;
	author: Author[];
	description: string;
	longDescription: string;
	image: LogoClass;
	video?: Video;
	publisher: Publisher;
	name: string;
	aggregateRating: AggregateRating;
	cookTime: string;
	nutrition: Nutrition;
	prepTime: string;
	recipeCategory: string[];
	recipeCuisine: string[];
	recipeIngredient: string[];
	recipeInstructions: RecipeInstruction[];
	recipeYield: string[];
	totalTime: string;
	review: Review[];
	mainEntityOfPage: MainEntityOfPage;
	about: any[];
};

type AggregateRating = {
	"@type": string;
	ratingValue: string;
	ratingCount: string;
};

type Author = {
	"@type": AuthorType;
	name: string;
};

enum AuthorType {
	Person = "Person",
}

type LogoClass = {
	"@type": string;
	url: string;
	height: number;
	width: number;
};

type MainEntityOfPage = {
	"@type": string[];
	"@id": string;
	breadcrumb: Breadcrumb;
	reviewedBy: ReviewedBy[];
};

type Breadcrumb = {
	"@type": string;
	itemListElement: ItemListElement[];
};

type ItemListElement = {
	"@type": string;
	position: number;
	item: Item;
};

type Item = {
	"@id": string;
	name: string;
};

type ReviewedBy = {
	"@type": AuthorType;
	name: string;
	url: string;
};

type Nutrition = {
	"@type": string;
	calories?: string;
	carbohydrateContent?: string;
	cholesterolContent?: string;
	fiberContent?: string;
	proteinContent?: string;
	saturatedFatContent?: string;
	sodiumContent?: string;
	sugarContent?: string;
	fatContent?: string;
	unsaturatedFatContent?: string;
};

type Publisher = {
	"@type": string;
	name: string;
	url: string;
	logo: LogoClass;
	brand: string;
	publishingPrinciples: string;
	sameAs: string[];
};

type RecipeInstruction = {
	"@type": string;
	text: string;
	image?: ImageElement[];
};

type ImageElement = {
	"@type": string;
	url: string;
};

type Review = {
	"@type": ReviewType;
	reviewRating: ReviewRating;
	author: Author;
	reviewBody: string;
};

enum ReviewType {
	Review = "Review",
}

type ReviewRating = {
	"@type": ReviewRatingType;
	ratingValue: string;
};

enum ReviewRatingType {
	Rating = "Rating",
}

type Video = {
	"@type": string;
	contentUrl: string;
	description: string;
	duration: string;
	name: string;
	thumbnailUrl: string;
	uploadDate: Date;
};
