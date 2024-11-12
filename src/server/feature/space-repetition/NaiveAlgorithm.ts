import { addMinute } from "@formkit/tempo";
import { Seq } from "immutable";
import type { RepetitionAlgorithm, Settings } from "./SpaceRepetition";
import type { Attempt } from "./types/Attempt";
import { GrammarPointSession } from "./types/GrammarPointSession";
import { calculateNextStage } from "./types/Stage";

// TODO: Tests are definitely needed
export const NaiveAlgorithm: RepetitionAlgorithm = {
  getSchedule(attempts: Attempt[], settings: Settings) {
    /**
     *
     * @returns last incorrect in the latest session or last correct if no such
     */
    const findNeededAttempt = (gpAttempts: Seq.Indexed<Attempt>) => {
      const lastGpSession = gpAttempts
        .groupBy((v) => v.reviewSessionId)
        .map((session) => GrammarPointSession(session.toArray()))
        .valueSeq()
        .maxBy((v) => v?.completedAt);

      return lastGpSession?.lastIncorrect ?? lastGpSession?.lastCorrect;
    };

    const latestAttempts = Seq(attempts)
      .groupBy((v) => v.grammarPointId)
      .map(findNeededAttempt)
      .valueSeq()
      .filter((v): v is Attempt => !!v);

    return latestAttempts
      .map((a) => {
        const stage = calculateNextStage(
          a.stage,
          settings.stageDowngradeMultiplier,
          a.isCorrect,
        );

        return {
          grammarPointId: a.grammarPointId,
          stage,
          availableAt: addMinute(a.answeredAt, settings.stageMinutes[stage]),
        };
      })
      .toArray();
  },
};
