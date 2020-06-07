/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getMatchingTodos = /* GraphQL */ `
  query GetMatchingTodos($title: String!) {
    getMatchingTodos(title: $title) {
      id
      title
      description
      updatedAt
      createdAt
    }
  }
`;
export const getTodo = /* GraphQL */ `
  query GetTodo($id: ID!) {
    getTodo(id: $id) {
      id
      title
      description
      updatedAt
      createdAt
    }
  }
`;
export const listTodos = /* GraphQL */ `
  query ListTodos(
    $filter: ModelTodoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTodos(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        description
        updatedAt
        createdAt
      }
      nextToken
    }
  }
`;
