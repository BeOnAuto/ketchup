export interface SessionStarted {
  type: 'SessionStarted';
  sessionId: string;
  cwd: string;
  gitBranch: string;
  version: string;
  entrypoint: string;
  timestamp: string;
  source: { line: string; uuid: string };
}

interface Envelope {
  sessionId: string;
  cwd: string;
  gitBranch: string;
  version: string;
  entrypoint: string;
  timestamp: string;
  uuid: string;
}

export function parseSessionStarted(line: string): SessionStarted {
  const envelope: Envelope = JSON.parse(line);
  return {
    type: 'SessionStarted',
    sessionId: envelope.sessionId,
    cwd: envelope.cwd,
    gitBranch: envelope.gitBranch,
    version: envelope.version,
    entrypoint: envelope.entrypoint,
    timestamp: envelope.timestamp,
    source: { line, uuid: envelope.uuid },
  };
}
