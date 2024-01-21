// -- Imports

import bodyParser from "body-parser";
import cors from "cors";
import { configDotenv } from "dotenv";
import express from "express";

import { setupEmailTransport } from "@/functions/Email";
import { requireSession } from "@/functions/Middleware";
import { connectToMongo } from "@database/Database";

// -- Pre init

configDotenv(); // Load .env file
connectToMongo(); // Connect to mongo
setupEmailTransport(); // Setup email transport

// -- Constants

const env = process.env;
const port = (env.PORT && parseInt(env.PORT)) || 4040;

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// -- Routes

async function main() {
	const authRoutes = {
		register: (await import("@routes/auth/Register")).default,
		login: (await import("@routes/auth/Login")).default,
		verifyCode: (await import("@routes/auth/VerifyCode")).default,
	};

	const userRoutes = {
		getInfo: (await import("@routes/user/GetInfo")).default,
	};

	const routes = {
		getRecipe: (await import("@/routes/Recipe")).default,
		search: (await import("@routes/Search")).default,
		root: (await import("@routes/Root")).default,
		authRoutes: authRoutes,
	};

	// Get Routes

	app.get("/recipe/:id/:rawTitle", routes.getRecipe);
	app.get("/search", routes.search); // ?q=chicken&page=0
	app.get("/", routes.root);

	// Auth Routes

	app.post("/auth/register", authRoutes.register);
	app.post("/auth/login", authRoutes.login);
	app.post("/auth/verifyCode", requireSession, authRoutes.verifyCode); // ?code=1234

	// User Routes

	app.get("/user/getInfo", requireSession, userRoutes.getInfo);

	// Start server

	app.listen(port, "0.0.0.0", () => {
		console.log(`Server listening on http://127.0.0.1:${port}`);
	});
}

main();
