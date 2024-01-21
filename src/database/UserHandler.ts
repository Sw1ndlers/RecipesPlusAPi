import { Err, Ok, Result } from "@/types/Results";
import { Session, User, UserType } from "@database/Models/User";
import { Document } from "mongoose";
import { createSession, hashPassword, isExpired } from "./Registration";

export interface UserDocument extends UserType, Document {}

export class UserHandler {
	user: UserDocument;

	constructor(user: UserDocument) {
		this.user = user;
	}

	async CreateSession(): Promise<Session> {
		const user = this.user;
		const session = createSession();

		user.sessions.push(session);
		await user.save();

		return session;
	}

	async VerifyCode(code: string): Promise<Result<string, string>> {
		const user = this.user;

		if (user.emailVerification.verified) {
			return Err("Email already verified");
		}

		if (user.emailVerification.code.toString() != code) {
			return Err("Invalid code");
		}

		if (isExpired(user.emailVerification.expiration)) {
			return Err("Code expired");
		}

		user.emailVerification.verified = true;
		await user.save();

		return Ok("Email verified");
	}

	static async loginToAccount(
		usernameOrEmail: string,
		password: string,
	): Promise<Result<UserHandler, string>> {
		const user = await UserHandler.findByUsernameOrEmail(usernameOrEmail);

		if (user == null) {
			return Err("Invalid username or email");
		}

		const salt = user.password.salt;
		const hash = user.password.hash;

		const inputtedHash = hashPassword(password, salt);

		if (hash != inputtedHash) {
			return Err("Invalid password");
		}

		return Ok(new UserHandler(user));
	}

	static async findByUsername(
		username: string,
	): Promise<UserDocument | null> {
		return User.findOne({ username: username });
	}

	static async findByEmail(email: string): Promise<UserDocument | null> {
		return User.findOne({ email: email });
	}

	static async findByUsernameOrEmail(
		usernameOrEmail: string,
	): Promise<UserDocument | null> {
		return User.findOne({
			$or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
		});
	}

	static async findBySessionToken(
		token: string,
	): Promise<UserDocument | null> {
		return User.findOne({
			sessions: {
				$elemMatch: {
					token: token,
				},
			},
		});
	}

	static async usernameTaken(username: string): Promise<boolean> {
		const user = await UserHandler.findByUsername(username);
		return user != null;
	}

	static async emailTaken(email: string): Promise<boolean> {
		const user = await UserHandler.findByEmail(email);
		return user != null;
	}
}
