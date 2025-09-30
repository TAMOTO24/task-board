import { Button, Select, Row, List, Tag, Checkbox } from "antd";
import { Task, Status } from "./types";

interface TaskProps {
  task: Task[];
  onChangePriority: (id: string, priority: number) => void;
  onDelete: (id: string) => void;
  onChangeStatus: (id: string, status: Status) => void;
}

const TaskList: React.FC<TaskProps> = ({
  task,
  onChangePriority,
  onDelete,
  onChangeStatus,
}) => {
  return (
    <Row gutter={[16, 16]}>
      <List
        bordered
        style={{ width: "100%" }}
        dataSource={task}
        renderItem={(item) => (
          <List.Item key={item?._id}>
            <List.Item.Meta
              title={
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <Checkbox
                    checked={item.status === "done"}
                    onClick={() =>
                      onChangeStatus(
                        item._id,
                        item.status === "done" ? "undone" : "done"
                      )
                    }
                  />
                  <h2 style={{ margin: 0 }}>{item.title}</h2>
                </div>
              }
              description={
                <div style={{ display: "flex", gap: "8px" }}>
                  <div style={{ flex: 1, display: "flex", gap: "50px" }}>
                    <p>{item.description}</p>
                    <p>
                      Status:{" "}
                      <Tag color={item.status === "done" ? "green" : "volcano"}>
                        {item.status}
                      </Tag>
                    </p>
                  </div>

                  <div>
                    <Select
                      value={String(item.priority)}
                      style={{ width: 80 }}
                      onChange={(value) =>
                        onChangePriority(item._id, Number(value))
                      }
                      options={Array.from({ length: 10 }, (_, i) => ({
                        value: String(i + 1),
                        label: String(i + 1),
                      }))}
                    />

                    <Button
                      danger
                      onClick={() => onDelete(item._id)}
                      style={{ marginLeft: 8 }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              }
            />
          </List.Item>
        )}
      />
    </Row>
  );
};

export default TaskList;
