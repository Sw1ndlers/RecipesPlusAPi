import { connect } from "mongoose";

export async function connectToMongo() {
	const mongoURI = process.env.MONGO_URI || "";

	if (!mongoURI) {
		throw new Error("No mongo URI provided");
	}

	await connect(mongoURI);
}
