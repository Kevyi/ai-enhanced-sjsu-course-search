import { GraphQLClient } from "graphql-request";
import { getTeacherRatingsQuery, searchTeacherQuery, TeacherRatings, TeacherSearchResults } from "./queries";

const ENDPOINT = "https://www.ratemyprofessors.com/graphql";
const AUTH_HEADER = "Basic dGVzdDp0ZXN0"
const SCHOOL_ID = "U2Nob29sLTg4MQ==";

const client = new GraphQLClient(ENDPOINT, {
    headers: {
        Authorization: AUTH_HEADER
    },
    fetch
});

export async function searchTeacher(name: string): Promise<TeacherSearchResults> {
    return await client.request(searchTeacherQuery, {
        includeSchoolFilter: true,
        query: {
            fallback: true,
            schoolID: SCHOOL_ID,
            text: name
        },
        schoolID: SCHOOL_ID
    });
}

export async function getTeacherRatings(id: string): Promise<TeacherRatings> {
    return await client.request(getTeacherRatingsQuery, {id});
}