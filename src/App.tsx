import { useEffect, useState } from "react";
import { client } from "./lib/apollo";
import { GET_ALL_LOTTERY } from "./utils/ApolloQuery";

interface ILottery {
  __typename: string;
  id: number;
  nome: string;
}

function App() {
  const [lotteryList, setLotteryList] = useState<ILottery[]>([]);

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
  useEffect(() => {
    getLotteryListFromGraphQL();
  }, []);

  return (
    <main className="w-full h-screen border-4 border-solid border-emerald-900">
      {lotteryList.length > 0 ? 
      <select name="" id="">
        {lotteryList.map(lottery => 
          <option value={lottery.id}>{lottery.nome.toUpperCase()}</option>  
        )}
      </select> 
      : null}
    </main>
  );
}

export default App;
