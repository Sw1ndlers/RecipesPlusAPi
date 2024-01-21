import { Err, None, Ok, Option, Result, Some } from "@/types/Results";
import axios from "axios";
import { HTMLElement, parse } from "node-html-parser";

export async function getHtmlRoot(url: string): Promise<Option<HTMLElement>> {
	return axios
		.get(url)
		.then((response) => {
			return Some(parse(response.data));
		})
		.catch((_error) => {
			return None();
		});
}

type ValidateData = {
	data: any | undefined;
	message: string;
};

export function validate(data: any, message: string): Result<any, string> {
	if (data == undefined) {
		return Err(message);
	}
	return Ok(data);
}

export function createValidator(data: any, message: string): ValidateData {
	return { data, message };
}

export function validateData(dataArray: ValidateData[]): Result<any, string> {
	for (const data of dataArray) {
		if (data.data == undefined) {
			return Err(data.message);
		}
	}

	return Ok(true);
}
