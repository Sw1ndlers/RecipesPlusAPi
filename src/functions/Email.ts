import { SentMessageInfo, createTransport } from "nodemailer";
import Mail from "nodemailer/lib/mailer";

const env = process.env;
let emailTransport: Mail<SentMessageInfo>;

export function setupEmailTransport() {
	emailTransport = createTransport({
		host: "smtp.mailgun.org",
		port: 587,
		secure: false,
		auth: {
			user: env.SMPT_USERNAME,
			pass: env.SMPT_PASSWORD,
		},
	});
}

export function emailValid(email: string) {
	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	return emailRegex.test(email);
}

type SendEmailData = {
	to: string;
	subject: string;
	html: string;
};

export function sendNoReply({ to, subject, html }: SendEmailData) {
	if (to == undefined || subject == undefined || html == undefined) {
		console.log(`
            Email not sent. Missing data.
            to: ${to}
            subject: ${subject}
            html: ${html}
        `);
	}

	emailTransport.sendMail({
		from: "noreply@recipesplus.live",
		to: to,
		subject: subject,
		html: html,
	});
}
