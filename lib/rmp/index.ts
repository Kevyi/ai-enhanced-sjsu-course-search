import { GraphQLClient } from "graphql-request";
import { getTeacherRatingsQuery, searchTeacherQuery, TeacherRatings, TeacherSearchResult, TeacherSearchResults } from "./queries";

const ENDPOINT = "https://www.ratemyprofessors.com/graphql";
const AUTH_HEADER = "Basic dGVzdDp0ZXN0"
const SCHOOL_ID = "U2Nob29sLTg4MQ==";

const client = new GraphQLClient(ENDPOINT, {
    headers: {
        Authorization: AUTH_HEADER
    },
    fetch
});

export async function searchTeacher(fullName: string): Promise<TeacherSearchResult | null> {
    const searchResults: TeacherSearchResults = await client.request(searchTeacherQuery, {
        includeSchoolFilter: true,
        query: {
            fallback: true,
            schoolID: SCHOOL_ID,
            text: decodeURIComponent(fullName)
        },
        schoolID: SCHOOL_ID
    });

    const edges = searchResults.search.teachers.edges;
    if (edges.length === 0) return null;

    const nameSegments = fullName.split(" ");
    const firstProfessor = edges[0].node;
    if (!firstProfessor.firstName.startsWith(nameSegments[0]))
        return null;
    if (nameSegments.length > 1 && !firstProfessor.lastName.endsWith(nameSegments[nameSegments.length - 1]))
        return null;
    return firstProfessor;
}

export async function getTeacherRatings(id: string): Promise<TeacherRatings> {
    return await client.request(getTeacherRatingsQuery, {id});
}