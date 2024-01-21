import { UserHandler } from "@/database/UserHandler";
import { createValidator, validateData } from "@/functions/Utils";
import { Err, Ok } from "@/types/Results";
import { Request, Response } from "express";

type RegisterData = {
	username: string;
	password: string;
	email: string;
};

export default async function (req: Request, res: Response) {
	const formData: RegisterData = req.body;

	if (formData == undefined) {
		return res.json(Err("No form data provided"));
	}

	let dataValid = validateData([
		createValidator(formData.username, "No username or email provided"),
		createValidator(formData.password, "No password provided"),
	]);

	if (!dataValid.ok) {
		return res.json(Err(dataValid.error));
	}

	const userHandler = await UserHandler.loginToAccount(
		formData.username,
		formData.password,
	);

	if (!userHandler.ok) {
		return res.json(Err(userHandler.error));
	}

	const newSession = await userHandler.value.CreateSession();

	return res.json(Ok(newSession.token));
}
