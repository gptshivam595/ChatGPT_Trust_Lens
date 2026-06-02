import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { LocalFileTrustLensStore } from "../src/persistence/localFileStore.js";
import { MemoryTrustLensStore } from "../src/persistence/memoryStore.js";
import { MockTrustLensService } from "../src/services/mockTrustLensService.js";

describe("Trust Lens persistence", () => {
  const tempDirs: string[] = [];

  afterEach(async () => {
    await Promise.all(tempDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })));
  });

  it("persists sessions, answers, sources, and recheck completion to a local file store", async () => {
    const dataDir = await mkdtemp(join(tmpdir(), "trust-lens-store-"));
    tempDirs.push(dataDir);

    const firstStore = new LocalFileTrustLensStore(dataDir);
    await firstStore.init();
    const firstService = new MockTrustLensService(firstStore);

    const session = await firstService.createSession({
      clientMode: "prototype",
      timezone: "Asia/Calcutta",
      locale: "en-IN"
    });
    const answer = await firstService.generateFinalAnswer({
      sessionId: session.sessionId,
      selectedPrompt: "Analyze Trust Lens.",
      selectedPromptMode: "improved",
      selectedDirectionId: "decision_ready"
    });
    const source = await firstService.getSourcePassage("source_mock_001");
    const recheck = await firstService.startRecheck({
      sessionId: session.sessionId,
      answerId: answer.answerId,
      mode: "claim_level"
    });

    expect(source.id).toBe("source_mock_001");

    const secondStore = new LocalFileTrustLensStore(dataDir);
    await secondStore.init();
    const secondSnapshot = await secondStore.read();

    expect(secondSnapshot.sessions[session.sessionId]).toBeDefined();
    expect(secondSnapshot.generatedAnswers[answer.answerId]).toBeDefined();
    expect(secondSnapshot.sourcePassages.source_mock_001).toBeDefined();
    expect(secondSnapshot.recheckJobs[recheck.jobId].status).toBe("running");

    const secondService = new MockTrustLensService(secondStore);
    const completed = await secondService.getRecheckStatus(recheck.jobId);
    expect(completed.status).toBe("complete");
    expect(completed.summary?.claimsReviewed).toBe(4);

    const finalSnapshot = await secondStore.read();
    expect(finalSnapshot.recheckJobs[recheck.jobId].status).toBe("complete");
    expect(finalSnapshot.recheckJobs[recheck.jobId].completedAt).toBeDefined();
  });

  it("blocks duplicate running recheck jobs for the same answer", async () => {
    const store = new MemoryTrustLensStore();
    const service = new MockTrustLensService(store);

    const session = await service.createSession({ clientMode: "prototype" });
    const answer = await service.generateFinalAnswer({
      sessionId: session.sessionId,
      selectedPrompt: "Analyze Trust Lens.",
      selectedPromptMode: "improved",
      selectedDirectionId: "decision_ready"
    });

    await service.startRecheck({
      sessionId: session.sessionId,
      answerId: answer.answerId,
      mode: "claim_level"
    });

    await expect(
      service.startRecheck({
        sessionId: session.sessionId,
        answerId: answer.answerId,
        mode: "claim_level"
      })
    ).rejects.toMatchObject({
      code: "RECHECK_ALREADY_RUNNING",
      statusCode: 409
    });
  });
});
