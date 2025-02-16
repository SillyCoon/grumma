import type { SessionResult as SessionResultType } from "space-repetition";
import { Card, CardContent, CardHeader, CardTitle } from "ui/card";

export const SessionResult = (props: {
  sessionResult: SessionResultType;
}) => {
  return (
    <div>
      <h1 class="text-3xl">Хорошая работа!</h1>

      <Accuracy
        total={props.sessionResult.total}
        correct={props.sessionResult.correct}
      />
    </div>
  );
};

const Accuracy = (props: { total: number; correct: number }) => {
  return (
    <Card class="w-60" variant="outlined">
      <CardHeader>
        <CardTitle>Accuracy</CardTitle>
        <div>{((props.correct / props.total) * 100).toFixed(2)}%</div>
      </CardHeader>
      <CardContent>
        <div class="flex flex-row justify-between">
          <div>
            Correct: <span class="text-success">{props.correct}</span>
          </div>
          <div>
            Incorrect:{" "}
            <span class="text-error">{props.total - props.correct}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
