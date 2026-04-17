export interface PromptSubmitted {
  type: 'PromptSubmitted';
  sessionId: string;
  prompt: string;
  timestamp: string;
  source: { line: string; uuid: string };
}

interface Envelope {
  type: string;
  sessionId: string;
  timestamp: string;
  uuid: string;
  message: { content: string | unknown[] };
}

export function parsePromptSubmitted(line: string): PromptSubmitted[] {
  const envelope: Envelope = JSON.parse(line);
  if (envelope.type !== 'user' || typeof envelope.message.content !== 'string') {
    return [];
  }
  return [
    {
      type: 'PromptSubmitted',
      sessionId: envelope.sessionId,
      prompt: envelope.message.content,
      timestamp: envelope.timestamp,
      source: { line, uuid: envelope.uuid },
    },
  ];
}
