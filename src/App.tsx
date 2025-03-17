import { useEffect, useState } from "react";
import "./styles.css";

interface responseInterface {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export default function App() {
  const [responseData, setResponseData] = useState<responseInterface[]>([]);

  const [newData, setNewData] = useState<Partial<responseInterface>>({
    completed: false,
  });

  const [filter, setFilter] = useState("all");

  const [search, setSearch] = useState("");
  
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/todos?_limit=10")
      .then((response) => response?.json())
      .then((data) => setResponseData(data))
      .catch((error) => console.error(error));
  }, []);

  const addObj = (newData: Partial<responseInterface>) => {
    let nextId = responseData.length + 1;
    setResponseData([...responseData, { ...newData, id: nextId, userId: responseData[0].userId || 1} as responseInterface]);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setNewData({ ...newData, [e.target.name]: e.target.value });
  };

  const onRemove = (id: number) => {
    setResponseData(responseData?.filter((data: responseInterface) => data.id !== id));
  };

 const onChangeComplete = (id: number) => {
  setResponseData(responseData?.map((data: responseInterface) => {
    if(data?.id === id) {
      return {...data, completed: !data.completed}
    }
    return data
  }))
 }

  const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setSearch(e.target.value);
  }

  const onFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    setFilter(e.target.value);
  }

  const filterData = responseData.filter((data: responseInterface) => {
    const searchFilter = data?.title?.toLowerCase().includes(search.toLowerCase());
    const taskFilter = filter === "all" || (filter === "completed" && data?.completed ) || (filter === "uncompleted" && !data?.completed);

    return searchFilter && taskFilter;
  })

  return (
    <div className="App">
      <div>
        <input type="text" placeholder="Search" onChange={(e) => onChangeSearch(e)}></input>
        <select onChange={(e) => onFilter(e)}>
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="uncompleted">Uncompleted</option>
        </select>
      </div>
      <div className="input_container">
        <input type="text" name="title" placeholder="title" onChange={(e) => onChange(e)}></input>
        <div className="checkbox_container">
          <p>Task Completed</p>
          <input type="checkbox" name="completed" placeholder="completed" onChange={(e) => onChange(e)}></input>
        </div>
        <button onClick={() => addObj(newData)}> Add </button>
      </div>
      <div >
      {filterData.length >= 1 &&
        filterData?.map((data: responseInterface) => {
          return(
            <div key={data?.id} className="data_container">
              <p>Title: {data?.title}</p>
              <div className="user_data">
                <p>User ID: {data?.userId}</p>
                <p>ID: {data?.id}</p>
              </div>
              <p>Completed: {data?.completed ? <span className="completed_text">Completed</span> : <span className="uncompleted_text">Uncompleted</span>}</p>
              <button onClick={() => onRemove(data?.id)}>Remove</button>
              <button onClick={() => onChangeComplete(data?.id)}>{!data?.completed ? <span className="completed_text">Completed</span> : <span className="uncompleted_text">Uncompleted</span>}</button>
            </div>
          )
        })}
        </div>
    </div>
  );
}
