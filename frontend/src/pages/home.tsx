import { useEffect, useState } from "react";
import axios from "axios";
import { Input, Typography, message, Checkbox, Select } from "antd";
import { Task, Status } from "../components/types.ts";
import TaskList from "../components/taskList.tsx";
import '../index.css';
import CreateTaskModal from "../components/createTaskModal.tsx";

const { Title } = Typography;

function BoardList() {
  const [boards, setBoards] = useState<Task[]>([]);
  const [ascendingFilter, setAscendingFilter] = useState<boolean>(false);
  const [descendingFilter, setDescendingFilter] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortedBoards, setSortedBoards] = useState<Task[]>([]);

  useEffect(() => {
    const fetchBoards = async () => {
      const res = await axios.get("http://localhost:5000/tasks");
      setBoards(res.data);
      setSortedBoards(res.data);
    };
    fetchBoards();
  }, []);

  useEffect(() => {
    let filtered = [...boards];

    if (selectedFilter !== "all") {
      filtered = filtered.filter((b) => b.status === selectedFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter((b) =>
        b.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (ascendingFilter) filtered.sort((a, b) => a.priority - b.priority);
    if (descendingFilter) filtered.sort((a, b) => b.priority - a.priority);

    setSortedBoards(filtered);
  }, [boards, selectedFilter, searchTerm, ascendingFilter, descendingFilter]);

  const handleDelete = async (id: string) => {
    await axios.delete(`http://localhost:5000/tasks/${id}`);
    setBoards(boards.filter((board) => board._id !== id));
  };

  const handleChangePriority = async (id: string, newPriority: number) => {
    try {
      setBoards((prevBoards) =>
        prevBoards.map((b) =>
          b._id === id ? { ...b, priority: newPriority } : b
        )
      );
      await axios.put(`http://localhost:5000/tasks/${id}`, { priority: newPriority });
    } catch {
      message.error("Failed to update priority");
    }
  };

  const onChangeStatus = async (id: string, newStatus: Status) => {
    try {
      setBoards((prevBoards) =>
        prevBoards.map((b) => (b._id === id ? { ...b, status: newStatus } : b))
      );
      await axios.put(`http://localhost:5000/tasks/${id}`, { status: newStatus });
    } catch {
      message.error("Failed to update status");
    }
  };

  const updateBoard = (newItem: Task) => {
    setBoards((prevBoards) => [...prevBoards, newItem]);
  };

  const statusFilter = (value: string) => setSelectedFilter(value);
  const search = (value: string) => setSearchTerm(value);

  return (
    <div className="p-6">
      <Title level={2} className="text-center mb-6">Task Boards</Title>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <CreateTaskModal updateBoard={updateBoard} />

        <Input
          placeholder="Search..."
          className="w-52"
          onChange={(e) => search(e.target.value)}
        />

        <div className="flex items-center gap-4">
          <Checkbox
            checked={ascendingFilter}
            onChange={(e) => {
              setAscendingFilter(e.target.checked);
              if (e.target.checked) setDescendingFilter(false);
            }}
          >
            Ascending
          </Checkbox>

          <Checkbox
            checked={descendingFilter}
            onChange={(e) => {
              setDescendingFilter(e.target.checked);
              if (e.target.checked) setAscendingFilter(false);
            }}
          >
            Descending
          </Checkbox>
        </div>

        <Select
          defaultValue="all"
          className="w-32"
          onChange={(value) => statusFilter(value)}
          options={[
            { value: "all", label: "All" },
            { value: "done", label: "Done" },
            { value: "undone", label: "Undone" },
          ]}
        />
      </div>

      <TaskList
        task={sortedBoards}
        onChangePriority={handleChangePriority}
        onDelete={handleDelete}
        onChangeStatus={onChangeStatus}
      />
    </div>
  );
}

export default BoardList;