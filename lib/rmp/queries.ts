import { gql } from "graphql-request";

export const searchTeacherQuery = gql`
query TeacherSearchResultsPageQuery(
  $query: TeacherSearchQuery!
  $schoolID: ID
  $includeSchoolFilter: Boolean!
) {
  search: newSearch {
    ...TeacherSearchPagination_search_1ZLmLD
  }
  school: node(id: $schoolID) @include(if: $includeSchoolFilter) {
    __typename
    ... on School {
      name
      ...StickyHeaderContent_school
    }
    id
  }
}

fragment CardFeedback_teacher on Teacher {
  wouldTakeAgainPercent
  avgDifficulty
}

fragment CardName_teacher on Teacher {
  firstName
  lastName
}

fragment CardSchool_teacher on Teacher {
  department
  school {
    name
    id
  }
}

fragment CompareSchoolLink_school on School {
  legacyId
}

fragment HeaderDescription_school on School {
  name
  city
  state
  legacyId
  ...RateSchoolLink_school
  ...CompareSchoolLink_school
}

fragment HeaderRateButton_school on School {
  ...RateSchoolLink_school
  ...CompareSchoolLink_school
}

fragment RateSchoolLink_school on School {
  legacyId
}

fragment StickyHeaderContent_school on School {
  name
  ...HeaderDescription_school
  ...HeaderRateButton_school
}

fragment TeacherBookmark_teacher on Teacher {
  id
  isSaved
}

fragment TeacherCard_teacher on Teacher {
  id
  legacyId
  avgRating
  numRatings
  ...CardFeedback_teacher
  ...CardSchool_teacher
  ...CardName_teacher
  ...TeacherBookmark_teacher
}

fragment TeacherSearchPagination_search_1ZLmLD on newSearch {
  teachers(query: $query, first: 8, after: "") {
    didFallback
    edges {
      cursor
      node {
        ...TeacherCard_teacher
        id
        __typename
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
    resultCount
    filters {
      field
      options {
        value
        id
      }
    }
  }
}
`;

export interface TeacherSearchResults {
  school: {
    city: string,
    id: string,
    legacyId: number,
    name: string,
    state: string
  },
  search: {
    teachers: {
      didFallback: boolean,
      edges: {
        cursor: string,
        node: TeacherSearchResult
      }[],
      filters: {
        field: string,
        options: {
          id: string,
          value: string
        }[]
      }[],
      pageInfo: {
        endCursor: string,
        hasNextPage: boolean
      },
      resultCount: number
    }
  }
}

export interface TeacherSearchResult {
  avgDifficulty: number,
  avgRating: number,
  department: string,
  firstName: string,
  id: string,
  isSaved: boolean,
  lastName: string,
  legacyId: number,
  numRatings: number,
  school: {
      id: string,
      name: string
  },
  wouldTakeAgainPercent: number
}

export const getTeacherRatingsQuery = gql`
query TeacherRatingsPageQuery(
  $id: ID!
) {
  node(id: $id) {
    __typename
    ... on Teacher {
      id
      legacyId
      firstName
      lastName
      department
      school {
        legacyId
        name
        city
        state
        country
        id
      }
      lockStatus
      ...StickyHeaderContent_teacher
      ...RatingDistributionWrapper_teacher
      ...TeacherInfo_teacher
      ...SimilarProfessors_teacher
      ...TeacherRatingTabs_teacher
    }
    id
  }
}

fragment StickyHeaderContent_teacher on Teacher {
  ...HeaderDescription_teacher
  ...HeaderRateButton_teacher
}

fragment RatingDistributionWrapper_teacher on Teacher {
  ...NoRatingsArea_teacher
  ratingsDistribution {
    total
    ...RatingDistributionChart_ratingsDistribution
  }
}

fragment TeacherInfo_teacher on Teacher {
  id
  lastName
  numRatings
  ...RatingValue_teacher
  ...NameTitle_teacher
  ...TeacherTags_teacher
  ...NameLink_teacher
  ...TeacherFeedback_teacher
  ...RateTeacherLink_teacher
  ...CompareProfessorLink_teacher
}

fragment SimilarProfessors_teacher on Teacher {
  department
  relatedTeachers {
    legacyId
    ...SimilarProfessorListItem_teacher
    id
  }
}

fragment TeacherRatingTabs_teacher on Teacher {
  numRatings
  courseCodes {
    courseName
    courseCount
  }
  ...RatingsList_teacher
  ...RatingsFilter_teacher
}

fragment RatingsList_teacher on Teacher {
  id
  legacyId
  lastName
  numRatings
  school {
    id
    legacyId
    name
    city
    state
    avgRating
    numRatings
  }
  ...Rating_teacher
  ...NoRatingsArea_teacher
  ratings(first: 20) {
    edges {
      cursor
      node {
        ...Rating_rating
        id
        __typename
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}

fragment RatingsFilter_teacher on Teacher {
  courseCodes {
    courseCount
    courseName
  }
}

fragment Rating_teacher on Teacher {
  ...RatingFooter_teacher
  ...RatingSuperHeader_teacher
  ...ProfessorNoteSection_teacher
}

fragment NoRatingsArea_teacher on Teacher {
  lastName
  ...RateTeacherLink_teacher
}

fragment Rating_rating on Rating {
  comment
  flagStatus
  createdByUser
  teacherNote {
    id
  }
  ...RatingHeader_rating
  ...RatingSuperHeader_rating
  ...RatingValues_rating
  ...CourseMeta_rating
  ...RatingTags_rating
  ...RatingFooter_rating
  ...ProfessorNoteSection_rating
}

fragment RatingHeader_rating on Rating {
  legacyId
  date
  class
  helpfulRating
  clarityRating
  isForOnlineClass
}

fragment RatingSuperHeader_rating on Rating {
  legacyId
}

fragment RatingValues_rating on Rating {
  helpfulRating
  clarityRating
  difficultyRating
}

fragment CourseMeta_rating on Rating {
  attendanceMandatory
  wouldTakeAgain
  grade
  textbookUse
  isForOnlineClass
  isForCredit
}

fragment RatingTags_rating on Rating {
  ratingTags
}

fragment RatingFooter_rating on Rating {
  id
  comment
  adminReviewedAt
  flagStatus
  legacyId
  thumbsUpTotal
  thumbsDownTotal
  thumbs {
    thumbsUp
    thumbsDown
    computerId
    id
  }
  teacherNote {
    id
  }
  ...Thumbs_rating
}

fragment ProfessorNoteSection_rating on Rating {
  teacherNote {
    ...ProfessorNote_note
    id
  }
  ...ProfessorNoteEditor_rating
}

fragment ProfessorNote_note on TeacherNotes {
  comment
  ...ProfessorNoteHeader_note
  ...ProfessorNoteFooter_note
}

fragment ProfessorNoteEditor_rating on Rating {
  id
  legacyId
  class
  teacherNote {
    id
    teacherId
    comment
  }
}

fragment ProfessorNoteHeader_note on TeacherNotes {
  createdAt
  updatedAt
}

fragment ProfessorNoteFooter_note on TeacherNotes {
  legacyId
  flagStatus
}

fragment Thumbs_rating on Rating {
  id
  comment
  adminReviewedAt
  flagStatus
  legacyId
  thumbsUpTotal
  thumbsDownTotal
  thumbs {
    computerId
    thumbsUp
    thumbsDown
    id
  }
  teacherNote {
    id
  }
}

fragment RateTeacherLink_teacher on Teacher {
  legacyId
  numRatings
  lockStatus
}

fragment RatingFooter_teacher on Teacher {
  id
  legacyId
  lockStatus
  isProfCurrentUser
  ...Thumbs_teacher
}

fragment RatingSuperHeader_teacher on Teacher {
  firstName
  lastName
  legacyId
  school {
    name
    id
  }
}

fragment ProfessorNoteSection_teacher on Teacher {
  ...ProfessorNote_teacher
  ...ProfessorNoteEditor_teacher
}

fragment ProfessorNote_teacher on Teacher {
  ...ProfessorNoteHeader_teacher
  ...ProfessorNoteFooter_teacher
}

fragment ProfessorNoteEditor_teacher on Teacher {
  id
}

fragment ProfessorNoteHeader_teacher on Teacher {
  lastName
}

fragment ProfessorNoteFooter_teacher on Teacher {
  legacyId
  isProfCurrentUser
}

fragment Thumbs_teacher on Teacher {
  id
  legacyId
  lockStatus
  isProfCurrentUser
}

fragment SimilarProfessorListItem_teacher on RelatedTeacher {
  legacyId
  firstName
  lastName
  avgRating
}

fragment RatingValue_teacher on Teacher {
  avgRating
  numRatings
  ...NumRatingsLink_teacher
}

fragment NameTitle_teacher on Teacher {
  id
  firstName
  lastName
  department
  school {
    legacyId
    name
    id
  }
  ...TeacherDepartment_teacher
  ...TeacherBookmark_teacher
}

fragment TeacherTags_teacher on Teacher {
  lastName
  teacherRatingTags {
    legacyId
    tagCount
    tagName
    id
  }
}

fragment NameLink_teacher on Teacher {
  isProfCurrentUser
  id
  legacyId
  firstName
  lastName
  school {
    name
    id
  }
}

fragment TeacherFeedback_teacher on Teacher {
  numRatings
  avgDifficulty
  wouldTakeAgainPercent
}

fragment CompareProfessorLink_teacher on Teacher {
  legacyId
}

fragment TeacherDepartment_teacher on Teacher {
  department
  departmentId
  school {
    legacyId
    name
    id
  }
}

fragment TeacherBookmark_teacher on Teacher {
  id
  isSaved
}

fragment NumRatingsLink_teacher on Teacher {
  numRatings
  ...RateTeacherLink_teacher
}

fragment RatingDistributionChart_ratingsDistribution on ratingsDistribution {
  r1
  r2
  r3
  r4
  r5
}

fragment HeaderDescription_teacher on Teacher {
  id
  legacyId
  firstName
  lastName
  department
  school {
    legacyId
    name
    city
    state
    id
  }
  ...TeacherTitles_teacher
  ...TeacherBookmark_teacher
  ...RateTeacherLink_teacher
  ...CompareProfessorLink_teacher
}

fragment HeaderRateButton_teacher on Teacher {
  ...RateTeacherLink_teacher
  ...CompareProfessorLink_teacher
}

fragment TeacherTitles_teacher on Teacher {
  department
  school {
    legacyId
    name
    id
  }
}
`

export interface TeacherRatings {
    node: {
        avgDifficulty: number,
        avgRating: number,
        coursesCode: {
            courseCount: number,
            courseName: string
        }[],
        department: string,
        departmentId: string,
        firstName: string,
        id: string,
        isProfCurrentUser: boolean,
        isSaved: boolean,
        lastName: string,
        legacyId: number,
        lockStatus: string,
        numRatings: number,
        ratings: {
            edges: {
                cursor: string,
                node: {
                    adminReviewedAt: string,
                    attendanceMandatory: string,
                    clarityRating: number,
                    class: string,
                    comment: string,
                    createdByUser: boolean,
                    date: string,
                    difficultyRating: number,
                    flagStatus: string,
                    grade: string,
                    helpfulRating: number,
                    id: string,
                    isForCredit: boolean,
                    isForOnlineClass: boolean,
                    legacyId: string,
                    ratingTags: string,
                    teacherNote: string | null,
                    textbookUse: number,
                    thumbs: unknown[], // TODO: Figure out what this is?
                    thumbsDownTotal: number,
                    thumbsUpTotal: number,
                    wouldTakeAgain: number
                }
            }[],
            pageInfo: {
                endCursor: string,
                hasNextPage: boolean
            }
        },
        ratingsDistribution: {
            r1: number,
            r2: number,
            r3: number,
            r4: number,
            r5: number,
            total: number
        },
        relatedTeachers: {
            avgRating: number,
            firstName: string,
            id: string,
            lastName: string,
            legacyId: number
        }[],
        school: {
            avgRating: number,
            city: string,
            country: string,
            id: string,
            legacyId: number,
            name: string,
            numRatings: number,
            state: string
        },
        teacherRatingTags: {
            id: string,
            legacyId: number,
            tagCount: number,
            tagName: string
        }[],
        wouldTakeAgainPercent: number
    }
}