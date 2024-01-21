import { UserDocument } from "@/database/UserHandler";
import express from "express";

export interface SessionRequest extends express.Request {
	user?: UserDocument;
}
