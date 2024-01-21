import { emailValid, sendNoReply } from "@/functions/Email";
import { Err, Ok, Result } from "@/types/Results";
import { EmailVerification, User } from "@database/Models/User";
import { createHash, randomBytes } from "crypto";
import { UserDocument, UserHandler } from "./UserHandler";

export function createSession() {
	const token = randomBytes(32).toString("hex");
	const expiration = Date.now() + 1000 * 60 * 60 * 24 * 30; // 30 days

	return {
		token: token,
		expiration: expiration,
	};
}

/// Returns true if the date is expired
export function isExpired(date: number) {
	return date < Date.now();
}

export function createSalt() {
	return randomBytes(16).toString("hex");
}

export function hashPassword(password: string, salt: string) {
	const combined = password + salt;

	return createHash("sha256").update(combined).digest("hex");
}

async function getLatestUid(): Promise<number> {
	const user = await User.findOne().sort({ uid: -1 });
	return user ? user.uid : 0;
}

/// Generates a 4 digit code, expiration date is 1 hour
function generateEmailVerification(): EmailVerification {
	const randomCode = Math.floor(1000 + Math.random() * 9000);
	const expiration = Date.now() + 1000 * 60 * 60; // 1 hour

	return {
		code: randomCode,
		expiration: expiration,
		verified: false,
	};
}

type RegisterData = {
	username: string;
	email: string;
	password: string;
};

export async function createUser({
	username,
	email,
	password,
}: RegisterData): Promise<Result<UserDocument, string>> {
	const emailTaken = await UserHandler.emailTaken(email);
	const usernameTaken = await UserHandler.usernameTaken(username);

	if (emailTaken) {
		return Err("Email already in use");
	}

	if (usernameTaken) {
		return Err("Username taken");
	}

	if (emailValid(email) == false) {
		return Err("Invalid email");
	}

	const registerDate = Date.now();
	const emailVerification = generateEmailVerification();

	const passwordSalt = createSalt();
	const hashedPassword = hashPassword(password, passwordSalt);

	const uid = (await getLatestUid()) + 1;
	const sessions = [createSession()]; // Create a session for the user

	sendNoReply({
		to: email,
		subject: "Email verification code",
		html: `Your email verification code is ${emailVerification.code}`,
	});

	const user = new User({
		username: username,
		email: email,
		uid: uid,
		registerDate: registerDate,
		emailVerification: emailVerification,
		password: {
			hash: hashedPassword,
			salt: passwordSalt,
		},
		sessions: sessions,
		favorites: [],
	});

	await user.save();

	return Ok(user);
}
