import { GraphQLClient } from "graphql-request";
import { getTeacherRatings, searchTeacher, Teacher, TeacherRating } from "./queries";

const ENDPOINT = "https://www.ratemyprofessors.com/graphql";
const AUTH_HEADER = "Basic dGVzdDp0ZXN0"
const SCHOOL_ID = "U2Nob29sLTg4MQ==";

const client = new GraphQLClient(ENDPOINT, {
    headers: {
        Authorization: AUTH_HEADER
    },
    fetch
});

export async function getTeacherInfo(name: string) {
    const searchResults: Teacher = await client.request(searchTeacher, {query: {text: name, schoolID: SCHOOL_ID}, count: 1, includeCompare: false});
    const teacherRating: TeacherRating = await client.request(getTeacherRatings, {id: searchResults.newSearch.teachers.edges[0].node.id})
    return teacherRating;
}