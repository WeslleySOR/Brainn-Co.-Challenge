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

export const GET_LOTERY_BY_CONTEST = gql`
  query LotteryByContest($id: Number!) {
    concurso(where: { id: $id }) {
      id
      loteria
      numeros
      data
    }
  }
`;
