import { gql } from "@apollo/client";

export const GET_ALL_LOTTERY = gql`
  query Lottery {
    loterias {
      id
      nome
    }
  }
`;

export const GET_ALL_LOTTERY_AND_CONTEST = gql`
  query LotteryAndContest {
    loteriasConcursos {
      loteriaId
      concursoId
    }
  }
`;

export const GET_LOTTERY_BY_CONTEST = gql`
  query LotteryByContest($id: ID!) {
    concurso(id: $id) {
      id
      loteria
      numeros
      data
    }
  }
`;
