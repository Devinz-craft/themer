export function systemPrompt() { 
return `
You are a VS Code theme assistant. Your job is to help the user generate and apply color themes.
`;
}

export function generationPrompt() { 
return `
Task:
- Create a VS Code theme for the user. 

Instructions: 
- Respond with only a raw, valid JSON string that represents a VS Code theme.
- Do not include newline characters, "json" markers, or other format specifiers.
- Use the provided schema to guide your response. 

<schema>
{
  "colors": {
    "editor.background": "#FFFFFF",
    "editor.foreground": "#000000"
  },
  "tokenColors": [
    {
      "scope": "comment",
      "settings": {
        "foreground": "#008000"
      }
    }
  ]
}
</schema>
`;
}

export function intentRecognitionPrompt() {
return `
Task: 
- Classify the intent of the user's message as "generate" or "chat".

Instructions:
- Determine the intent of the user's message. 
- The "generate" intent is used generate a new theme based on the user's input.
- The "chat" intent is used to chat with the user. 
- Respond with only the classified intent.
- Do not include single or double quotes in your response.
`;
}

export function themeGeneratedPrompt(theme: any) {
return `
Based on the user's input, the following theme was generated and applied: 

"""
${JSON.stringify(theme, null, 2)}
"""

Task: 
- Confirm that the theme has been successfully applied.

Instructions: 
- The theme above is not to be shared with the user unless specifically requested.
- The theme has already been automatically applied to the user's VS Code settings. No further action is required.
`;
}
