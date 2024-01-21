import { UserHandler } from "@/database/UserHandler";
import { SessionRequest } from "@/types/Express";
import { Err } from "@/types/Results";
import express from "express";

export async function requireSession(
	req: SessionRequest,
	res: express.Response,
	next: express.NextFunction,
) {
	const token = req.headers["authorization"];

	if (token == undefined) {
		return res.json(Err("No session token provided"));
	}

	if (typeof token != "string") {
		return res.json(Err("Invalid session token"));
	}

	const user = await UserHandler.findBySessionToken(token);

	if (user == null) {
		return res.json(Err("Invalid session token"));
	}

	req.user = user;
	next();
}
