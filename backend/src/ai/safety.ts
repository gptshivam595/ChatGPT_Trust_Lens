import type { SafetyFinding } from "./types.js";

const signatures: Array<{
  id: string;
  label: string;
  category: SafetyFinding["category"];
  severity: SafetyFinding["severity"];
  pattern: RegExp;
}> = [
  {
    id: "direct_role_override",
    label: "Instruction override attempt",
    category: "role_override",
    severity: "high",
    pattern: /\b(ignore|disregard|forget)\b.{0,40}\b(previous|prior|above|system)\b/i
  },
  {
    id: "system_prompt_extraction",
    label: "System prompt extraction attempt",
    category: "system_prompt_extraction",
    severity: "high",
    pattern: /\b(show|reveal|print|repeat|display)\b.{0,40}\b(system prompt|initial instructions|hidden instructions)\b/i
  },
  {
    id: "jailbreak_persona",
    label: "Jailbreak persona framing",
    category: "jailbreak",
    severity: "high",
    pattern: /\b(developer mode|dan mode|jailbreak|no restrictions|unfiltered)\b/i
  },
  {
    id: "tool_abuse",
    label: "Tool abuse instruction",
    category: "tool_abuse",
    severity: "critical",
    pattern: /\b(call|use|run)\b.{0,30}\b(delete|upload|exfiltrate|bypass approval|secret)\b/i
  },
  {
    id: "indirect_injection_marker",
    label: "Indirect injection marker",
    category: "indirect_injection",
    severity: "medium",
    pattern: /(<\s*system\s*>|\[\s*inst\s*\]|###\s*system|ignore the user)/i
  }
];

const compactEvidence = (text: string) => text.replace(/\s+/g, " ").trim().slice(0, 140);

export const scanForPromptInjection = (text: string): SafetyFinding[] =>
  signatures
    .filter((signature) => signature.pattern.test(text))
    .map((signature) => ({
      id: signature.id,
      label: signature.label,
      category: signature.category,
      severity: signature.severity,
      evidence: compactEvidence(text)
    }));

export const sanitizeRetrievedText = (text: string) =>
  text
    .replace(/<\s*system\s*>/gi, "[removed instruction marker]")
    .replace(/<\s*\/\s*system\s*>/gi, "[removed instruction marker]")
    .replace(/\[\s*inst\s*\]/gi, "[removed instruction marker]")
    .replace(/###\s*system/gi, "[removed instruction marker]");

export const hasHighRiskFinding = (findings: SafetyFinding[]) =>
  findings.some((finding) => finding.severity === "high" || finding.severity === "critical");
