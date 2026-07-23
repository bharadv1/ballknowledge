export type PlayerAttributes = {
    id: number;
    fullName: string;
    draftYear: number | null;
    draftPick: number | null;
    college: string | null;
};

export type DirectionResult =
    | "correct"
    | "higher"
    | "lower"
    | "unknown";

export type MatchResult =
    | "correct"
    | "incorrect"
    | "unknown";

export type PlayerComparison = {
    draftYear: DirectionResult;
    draftPick: DirectionResult;
    college: MatchResult;
};

function normalizeCollege(college: string | null) {
    return college?.trim().toLowerCase() ?? null;
}

function compareNumericAttribute(
    guessValue: number | null,
    answerValue: number | null,
): DirectionResult {
    if (guessValue === null || answerValue === null) {
        return "unknown";
    }

    if (guessValue === answerValue) {
        return "correct";
    }

    return answerValue > guessValue ? "higher" : "lower";
}

export function comparePlayerAttributes(
    guess: PlayerAttributes,
    answer: PlayerAttributes,
): PlayerComparison {
    const guessCollege = normalizeCollege(guess.college);
    const answerCollege = normalizeCollege(answer.college);

    let college: MatchResult = "unknown";

    if (guessCollege !== null && answerCollege !== null) {
        college =
            guessCollege === answerCollege
                ? "correct"
                : "incorrect";
    } else if (guessCollege === null && answerCollege === null) {
        college = "correct";
    }

    return {
        draftYear: compareNumericAttribute(
            guess.draftYear,
            answer.draftYear,
        ),
        draftPick: compareNumericAttribute(
            guess.draftPick,
            answer.draftPick,
        ),
        college,
    };
}