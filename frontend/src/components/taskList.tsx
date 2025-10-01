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
        className="w-full"
        dataSource={task}
        renderItem={(item) => (
          <List.Item key={item?._id} className="p-4">
            <List.Item.Meta
              title={
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={item.status === "done"}
                    onClick={() =>
                      onChangeStatus(
                        item._id,
                        item.status === "done" ? "undone" : "done"
                      )
                    }
                  />
                  <h2 className="m-0 text-lg font-semibold">{item.title}</h2>
                </div>
              }
              description={
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex-1 flex flex-col md:flex-row justify-between gap-12">
                    <p className="text-gray-700">{item.description}</p>
                    <p className="flex items-center gap-1 text-sm">
                      Status:{" "}
                      <Tag
                        color={item.status === "done" ? "green" : "volcano"}
                      >
                        {item.status}
                      </Tag>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Select
                      value={String(item.priority)}
                      className="w-20"
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
