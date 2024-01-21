import { Schema, model } from "mongoose";

export type EmailVerification = {
	code: number;
	expiration: UnixTimestamp;
	verified: boolean;
};

export type UnixTimestamp = number;
export type SessionToken = string;

type Password = {
	hash: string;
	salt: string;
};

export type Session = {
	token: SessionToken;
	expiration: UnixTimestamp;
};

type SavedRecipe = {
	id: number;
	title: string;
};

export type UserType = {
	username: string;
	email: string;
	uid: number;

	registerDate: UnixTimestamp;
	emailVerification: EmailVerification;

	password: Password;
	sessions: Session[];

	favorites: SavedRecipe[];
};

const passwordSchema = new Schema<Password>({
	hash: { type: String, required: true },
	salt: { type: String, required: true },
});

const sessionSchema = new Schema<Session>({
	token: { type: String, required: true },
	expiration: { type: Number, required: true },
});

const savedRecipeSchema = new Schema<SavedRecipe>({
	id: { type: Number, required: true },
	title: { type: String, required: true },
});

const emailVerificationSchema = new Schema<EmailVerification>({
	code: { type: Number, required: true },
	expiration: { type: Number, required: true },
	verified: { type: Boolean, required: true },
});

const userSchema = new Schema<UserType>(
	{
		username: { type: String, required: true },
		email: { type: String, required: true },
		uid: { type: Number, required: true },

		registerDate: { type: Number, required: true },
		emailVerification: { type: emailVerificationSchema, required: true },

		password: { type: passwordSchema, required: true },
		sessions: { type: [sessionSchema], required: true },

		favorites: { type: [savedRecipeSchema], required: true },
	},
	{ collection: "Users" },
);

export const User = model<UserType>("User", userSchema);
