export type RMPInfo = {
    [instructor_email: string]: RMPProfessorInfo
}

export type RMPProfessorInfo = {
    name: string,
    rmp: {
        "avgDifficulty": number,
        "avgRating": number,
        "id": string,
        "legacyId": string,
        "numRatings": number,
        "wouldTakeAgainPercent": number
    } | null;
};