import { Ok } from "@/types/Results";
import { Request, Response } from "express";

export default async function (req: Request, res: Response) {
	return res.json(Ok("API is running"));
}
