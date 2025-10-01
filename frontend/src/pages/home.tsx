import { useEffect, useState } from "react";
import axios from "axios";
import { Input, Space, Typography, message, Checkbox, Select } from "antd";
import { Task, Status } from "../components/types.ts";
import TaskList from "../components/taskList.tsx";
import CreateTaskModal from "../components/createTaskModal.tsx";

const { Title } = Typography;

function BoardList() {
  const [boards, setBoards] = useState<Task[]>([]);
  const [ascendingFilter, setAscendingFilter] = useState<boolean>(false);
  const [descendingFilter, setDescendingFilter] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const [sortedBoards, setSortedBoards] = useState<Task[]>([]);

  useEffect(() => { // get initial board data
    const fetchBoards = async () => {
      const res = await axios.get("http://localhost:5000/tasks");
      setBoards(res.data);
      setSortedBoards(res.data);
    };
    fetchBoards();
  }, []);

  useEffect(() => { // update sorted boards when boards change
    setSortedBoards(boards);
    statusFilter(selectedFilter);
  }, [boards]);

  useEffect(() => { // update sorted boards when filters change
    setSortedBoards(
      [...boards].sort((a, b) => {
        if (ascendingFilter) return a.priority - b.priority;
        if (descendingFilter) return b.priority - a.priority;

        return 0;
      })
    );
  }, [ascendingFilter, descendingFilter, boards]);

  const handleDelete = async (id: string): Promise<void> => {
    await axios.delete(`http://localhost:5000/tasks/${id}`);
    setBoards(boards.filter((board: Task) => board._id !== id));
  };

  const handleChangePriority = async (id: string, newPriority: number) => {
    try {
      setBoards((prevBoards) =>
        prevBoards.map((b) =>
          b._id === id ? { ...b, priority: newPriority } : b
        )
      );
      await axios.put(`http://localhost:5000/tasks/${id}`, {
        priority: newPriority,
      });
    } catch (err) {
      message.error("Failed to update priority");
    }
  };

  const onChangeStatus = async (id: string, newStatus: Status) => {
    try {
      setBoards((prevBoards) =>
        prevBoards.map((b) => (b._id === id ? { ...b, status: newStatus } : b))
      );
      await axios.put(`http://localhost:5000/tasks/${id}`, {
        status: newStatus,
      });
    } catch (err) {
      console.error("Failed to update status", err);
      message.error("Failed to update status");
    }
  };

  const updateBoard = (newItem: Task) => {
    setBoards((prevBoards) => [...prevBoards, newItem]);
  };

  const statusFilter = (value: string) => {
    setSelectedFilter(value);
    if (value === "all") setSortedBoards([...boards]);
    else setSortedBoards([...boards].filter((a) => a.status === value));
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: 24 }}>
        Task Boards
      </Title>

      <Space style={{ marginBottom: 24 }}>
        <CreateTaskModal updateBoard={updateBoard} />
        <Input placeholder="Search..." style={{ width: 200 }} />
        <Checkbox
          checked={ascendingFilter}
          onChange={(e) => {
            setAscendingFilter(e.target.checked);
            if (e.target.checked) setDescendingFilter(false);
          }}
        >
          Ascending priority filter
        </Checkbox>

        <Checkbox
          checked={descendingFilter}
          onChange={(e) => {
            setDescendingFilter(e.target.checked);
            if (e.target.checked) setAscendingFilter(false);
          }}
        >
          Descending priority filter
        </Checkbox>
        <Select
          defaultValue="All"
          style={{ width: 120 }}
          onChange={(value) => statusFilter(value)}
          options={[
            { value: "all", label: "All" },
            { value: "done", label: "Done" },
            { value: "undone", label: "Undone" },
          ]}
        />
      </Space>

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
