import { createUser } from "@/database/Registration";
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
		createValidator(formData.username, "No username provided"),
		createValidator(formData.password, "No password provided"),
		createValidator(formData.email, "No email provided"),
	]);

	if (!dataValid.ok) {
		return res.json(Err(dataValid.error));
	}

	const { username, password, email } = formData;
	const user = await createUser({
		username: username,
		password: password,
		email: email,
	});

	if (!user.ok) {
		return res.json(Err(user.error));
	}

	// Return the initial session token
	return res.json(Ok(user.value.sessions[0].token));
}
