import * as vscode from 'vscode';

export type Intent = "chat" | "generate";

export interface Theme {
  colors: Record<string, string>;
  tokenColors: Array<{
    scope: string | string[];
    settings: Record<string, string>;
  }>;
}

export interface ThemerChatResult extends vscode.ChatResult {
  metadata: {
    command: string;
  }
}