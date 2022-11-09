import { useEffect, useState } from "react";
import { client } from "./lib/apollo";
import {
  GET_ALL_LOTTERY,
  GET_ALL_LOTTERY_AND_CONTEST,
  GET_LOTTERY_BY_CONTEST,
} from "./utils/ApolloQuery";

interface ILottery {
  __typename: string;
  id: number;
  nome: string;
}

interface ILotteryAndOurContest {
  __typename: string;
  loteriaId: number;
  concursoId: string;
}

interface IContest {
  __typename: string;
  id: string;
  loteria: number;
  numeros: string[];
  data: string;
}

function App() {
  const [actualLotteryPage, setActualLotteryPage] = useState(0);
  const [actualContestPage, setActualContestPage] = useState<IContest>();
  const [lotteryList, setLotteryList] = useState<ILottery[]>([]);
  const [lotteryAndOurContestList, setLotteryAndOurContestList] = useState<
    ILotteryAndOurContest[]
  >([]);

  const handleLotterySelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setActualLotteryPage(parseInt(e.target.value));
    getAllDataFromContestID(e.target.value, lotteryAndOurContestList);
  };

  const getAllDataFromContestID = (
    id: string,
    lotteryAndOurContestList: ILotteryAndOurContest[]
  ) => {
    const contests = lotteryAndOurContestList.filter(
      (lottery) => lottery.loteriaId === parseInt(id)
    );
    allDataFromContest(contests[0].concursoId);
  };

  const getLotteryListFromGraphQL = async () => {
    await client
      .query({
        query: GET_ALL_LOTTERY,
      })
      .then(({ data }) => {
        setLotteryList(data.loterias);
      })
      .catch((error) => console.error(error));
  };

  const getLotteryAndOurContestListFromGraphQL = async () => {
    await client
      .query({
        query: GET_ALL_LOTTERY_AND_CONTEST,
      })
      .then(({ data }) => {
        setLotteryAndOurContestList(data.loteriasConcursos);
        getAllDataFromContestID(
          actualLotteryPage.toString(),
          data.loteriasConcursos
        );
      })
      .catch((error) => console.error(error));
  };

  const allDataFromContest = async (id: string) => {
    await client
      .query({
        query: GET_LOTTERY_BY_CONTEST,
        variables: {
          id: id,
        },
      })
      .then(({ data }) => {
        setActualContestPage(data.concurso);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    const allPromise = [
      getLotteryListFromGraphQL(),
      getLotteryAndOurContestListFromGraphQL(),
    ];
    Promise.all(allPromise);
  }, []);

  return (
    <main className="w-full h-screen border-4 border-solid border-emerald-900">
      {lotteryList.length > 0 ? (
        <select
          value={actualLotteryPage}
          onChange={(e) => handleLotterySelectChange(e)}
        >
          {lotteryList.map((lottery) => (
            <option value={lottery.id}>{lottery.nome.toUpperCase()}</option>
          ))}
        </select>
      ) : null}
      {actualContestPage ? actualContestPage.numeros.map(numero => <p>{numero}</p>) : null}
    </main>
  );
}

export default App;
