import React, { useState } from "react";
import { Button, Modal, Form, Input, Select, message } from "antd";
import axios from "axios";
import { Task } from "./types";
import { PlusOutlined } from "@ant-design/icons";

interface CreateTaskModalProps {
  updateBoard: (newItem: Task) => void;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ updateBoard }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => setIsModalOpen(false);

  const handleFinish = async (values: any) => {
    console.log("Form values:", values);
    setIsModalOpen(false);
    try {
      const res = await axios.post("http://localhost:5000/tasks", values);
      message.success("Task created successfully");
      updateBoard(res.data);
    } catch (err) {
      console.error("Failed to create task", err);
      message.error("Failed to create task");
    }
    form.resetFields();
  };

  return (
    <>
      <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
        Add Task
      </Button>
      <Modal
        title="Create Task"
        open={isModalOpen}
        footer={null}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please enter a title" }]}
          >
            <Input placeholder="Enter task title" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter a description" }]}
          >
            <Input.TextArea
              rows={3}
              placeholder="Tell us shortly about the task"
            />
          </Form.Item>

          <Form.Item
            label="Priority"
            name="priority"
            rules={[{ required: true, message: "Please set priority" }]}
          >
            <Select
              defaultValue={String(1)}
              options={Array.from({ length: 10 }, (_, i) => ({
                value: String(i + 1),
                label: String(i + 1),
              }))}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Create
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CreateTaskModal;
