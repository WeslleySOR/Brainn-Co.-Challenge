import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
  uri: "https://brainn-api-loterias.herokuapp.com/graphql",
  cache: new InMemoryCache(),
});