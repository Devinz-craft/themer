import * as vscode from 'vscode';
import { THEME_NAME } from './constants';
import type { Theme, Intent } from './types';
import { 
  systemPrompt, 
  generationPrompt, 
  intentRecognitionPrompt, 
} from './prompts';


export async function generateTheme(request: vscode.ChatRequest): Promise<Theme> {
  
  const messages = [
    vscode.LanguageModelChatMessage.User(systemPrompt()),
    vscode.LanguageModelChatMessage.User(request.prompt),
    vscode.LanguageModelChatMessage.User(generationPrompt()),
  ];
  
  const response = await request.model.sendRequest(messages, {}, );

  let text = '';
  for await (const fragment of response.text) {
    text += fragment;
  }

  return JSON.parse(text) as Theme;
}

export async function classifyIntent(request: vscode.ChatRequest): Promise<Intent> {
  
  const messages = [
    vscode.LanguageModelChatMessage.User(systemPrompt()),
    vscode.LanguageModelChatMessage.User(request.prompt),
    vscode.LanguageModelChatMessage.User(intentRecognitionPrompt()),
  ];
  
  const response = await request.model.sendRequest(messages, {}, );

  let text = '';
  for await (const fragment of response.text) {
    text += fragment;
  }

  return text as Intent;
}

export async function applyTheme(theme: Theme): Promise<void> {

  const config = vscode.workspace.getConfiguration();
  const colorCustomizations = config.get('workbench.colorCustomizations') || {};
  const tokenCustomizations = config.get('editor.tokenColorCustomizations') || {};

  await config.update('workbench.colorCustomizations', {
    ...colorCustomizations,
    [`[${THEME_NAME}]`]: theme.colors,
  }, vscode.ConfigurationTarget.Global);

  await config.update('editor.tokenColorCustomizations', {
    ...tokenCustomizations,
    [`[${THEME_NAME}]`]: theme.tokenColors,
  }, vscode.ConfigurationTarget.Global);
}