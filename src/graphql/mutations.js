/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createTodo = /* GraphQL */ `
  mutation CreateTodo($title: String!, $description: String!) {
    createTodo(title: $title, description: $description) {
      id
      title
      description
      updatedAt
      createdAt
    }
  }
`;
