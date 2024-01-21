import { SessionRequest } from "@/types/Express";
import { Ok } from "@/types/Results";
import { Response } from "express";

export default async function (req: SessionRequest, res: Response) {
	const user = req.user!;
	// const userHandler = new UserHandler(user);

	// return user.username;
	res.json(Ok(user.username));
}
