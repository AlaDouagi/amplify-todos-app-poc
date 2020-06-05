/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getTodos = /* GraphQL */ `
  query GetTodos($limit: Int, $start: Int) {
    getTodos(limit: $limit, start: $start) {
      id
      title
      description
      updatedAt
      createdAt
    }
  }
`;
export const getMatchingTodos = /* GraphQL */ `
  query GetMatchingTodos($name: String!) {
    getMatchingTodos(name: $name) {
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
