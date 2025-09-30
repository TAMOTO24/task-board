import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

type Status = "all" | "done" | "undone";

interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: number;
}

function BoardList() {
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    const fetchBoards = async () => {
      const res = await axios.get("http://localhost:5000/tasks");
      setBoards(res.data);
    };
    fetchBoards();
  }, []);

  return <div>
    {boards.map((board: Task) => (
      <div key={board.id}>
        <h2>{board.title}</h2>
        <p>{board.description}</p>]
        <p>Status: {board.status}</p>
        <p>Priority: {board.priority}</p>
      </div>
    ))}
  </div>;
}

export default BoardList;
