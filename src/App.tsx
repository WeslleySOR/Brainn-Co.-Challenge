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

  const actualLotteryName = () => {
    switch (actualLotteryPage) {
      case 0:
        return "bg-mega-sena";
      case 1:
        return "bg-quina";
      case 2:
        return "bg-loto-facil";
      case 3:
        return "bg-loto-mania";
      case 4:
        return "bg-time-mania";
      case 5:
        return "bg-dia-de-sorte";
      default:
        return "";
    }
  };

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
    <>
      {lotteryList.length > 0 ? (
        <main className="w-full h-screen flex flex-col max-w-screen overflow-x-hidden lg:flex-row">
          <div
            className={`${actualLotteryName()} relative flex flex-col gap-20 items-center py-16 lg:p-24
           after:absolute after:content-[''] 
           after:w-[110vw] after:h-24 after:bg-[#efefef] after:-bottom-12  after:rounded-t-[100%]
           lg:after:bottom-0 lg:after:h-[100vh] lg:after:w-14 lg:after:-right-8 lg:after:rounded-[100%]
          `}
          >
            <select
              className="bg-[#fff] py-4 px-6 rounded-lg drop-shadow-sm w-64"
              value={actualLotteryPage}
              onChange={(e) => handleLotterySelectChange(e)}
            >
              {lotteryList.map((lottery) => (
                <option value={lottery.id}>{lottery.nome.toUpperCase()}</option>
              ))}
            </select>
            <div className="flex flex-col items-center gap-3">
              <div className="relative w-[65px] h-16">
                <img className="absolute" src="/assets/Path 2.svg" alt="" />
                <img className="absolute" src="/assets/Path 3.svg" alt="" />
              </div>
              <h1 className="text-white text-3xl font-bold uppercase">
                {
                  lotteryList.filter(
                    (lottery) => lottery.id === actualLotteryPage
                  )[0].nome
                }
              </h1>
            </div>
            <h2 className="text-white text-base font-medium uppercase">
              Concurso Nº {actualContestPage?.id}
            </h2>
          </div>
          {actualContestPage ? (
            <div className="flex flex-col pb-8 lg:w-full">
              <div className="flex flex-wrap mt-auto items-center justify-center px-12 z-50 gap-6">
                {actualContestPage.numeros.map((numero) => (
                  <div className="w-[76px] h-[76px] flex items-center justify-center rounded-full bg-white">
                    <p className="text-xl font-bold text-[#333333]">{numero}</p>
                  </div>
                ))}
              </div>
              <span className="text-black text-sm font-normal text-center mt-20 lg:mt-auto">
                Este sorteio é meramente ilustrativo e não possui nenhuma
                ligação com a CAIXA.
              </span>
            </div>
          ) : null}
        </main>
      ) : null}
    </>
  );
}

export default App;
