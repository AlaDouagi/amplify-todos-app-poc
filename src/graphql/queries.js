/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getMatchingTodos = /* GraphQL */ `
  query GetMatchingTodos($owner: String!) {
    getMatchingTodos(owner: $owner) {
      id
      title
      description
      done
      owner
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
      done
      owner
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
        done
        owner
        updatedAt
        createdAt
      }
      nextToken
    }
  }
`;
export const todosByOwner = /* GraphQL */ `
  query TodosByOwner(
    $owner: String
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelTodoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    todosByOwner(
      owner: $owner
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        title
        description
        done
        owner
        updatedAt
        createdAt
      }
      nextToken
    }
  }
`;
