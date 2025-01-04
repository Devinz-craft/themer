import * as vscode from 'vscode';
import { systemPrompt, themeGeneratedPrompt } from './prompts';
import { PARTICIPANT_ID } from './constants';
import { generateTheme, classifyIntent, applyTheme } from './utils';
import type { ThemerChatResult } from './types';


export function activate(context: vscode.ExtensionContext) {
	const themer = vscode.chat.createChatParticipant(PARTICIPANT_ID, handler);
}

export function deactivate() {}

const handler: vscode.ChatRequestHandler = async (
	request: vscode.ChatRequest,
	context: vscode.ChatContext,
	stream: vscode.ChatResponseStream,
	token: vscode.CancellationToken
): Promise<ThemerChatResult> => {

	const messages = [
		vscode.LanguageModelChatMessage.User(systemPrompt()),
		vscode.LanguageModelChatMessage.User(request.prompt),
	]

	const intent = await classifyIntent(request);
	if (!(['generate', 'chat'].includes(intent))) {
		stream.markdown('Sorry, I did not understand your request.');
		return { metadata: { command: '' } };
	}

	if (intent === 'generate') {
		stream.progress('Generating theme...');
		const theme = await generateTheme(request);
		await applyTheme(theme);
		stream.markdown('');

		messages.push(
			vscode.LanguageModelChatMessage.User(themeGeneratedPrompt(theme)),
		)
	}
	
	const response = await request.model.sendRequest(messages, {}, );
	for await (const fragment of response.text) {
		stream.markdown(fragment);
	}
	
	return { metadata: { command: '' } };
};
