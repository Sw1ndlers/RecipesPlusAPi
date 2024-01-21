import { UserHandler } from "@/database/UserHandler";
import { SessionRequest } from "@/types/Express";
import { Err, Ok } from "@/types/Results";
import { Response } from "express";

export default async function (req: SessionRequest, res: Response) {
	const user = req.user!;
	let inputtedCode: string = req.query.code as string;

	if (inputtedCode == undefined) {
		return res.json(Err("No code provided"));
	}

	try {
		parseInt(inputtedCode);
	} catch {
		return res.json(Err("Invalid code"));
	}

	const userHandler = new UserHandler(user);
	const verifyResult = await userHandler.VerifyCode(inputtedCode);

	if (!verifyResult.ok) {
		return res.json(Err(verifyResult.error));
	}

	return res.json(Ok("Successfully verified user"));
}
