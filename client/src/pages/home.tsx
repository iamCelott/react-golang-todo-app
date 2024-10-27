import { useEffect, useState } from "react";
import trash from "../assets/trash.png";
import edit from "../assets/edit.png";

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const Home = () => {
  const [addTask, setAddTask] = useState<boolean>(false);
  const [editTask, setEditTask] = useState<number | null>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleTasks = async () => {
    try {
      const response = await fetch("http://localhost:8000/tasks");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setTasks(data);
    } catch (e) {
      console.error("Error submitting task:", e);
    }
  };

  const handleEdit = async (index: number) => {
    if (editTask === index) {
      setAddTask(false);
      setEditTask(null);
    } else {
      setAddTask(true);
      setEditTask(index);
      setTitle(tasks[index].title);
      setDescription(tasks[index].description);
    }
  };

  const handleCreate = () => {
    if (editTask == null) {
      setAddTask((prev) => !prev);
      setTitle("");
      setDescription("");
    } else {
      setEditTask(null);
      setTitle("");
      setDescription("");
      setAddTask(true);
    }
  };

  const handleSubmit = async () => {
    const todoData = {
      title,
      description,
    };

    try {
      let response;
      if (editTask === null) {
        response = await fetch("http://localhost:8000/task/store", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(todoData),
        });
      } else {
        response = await fetch(
          `http://localhost:8000/task/${tasks[editTask].id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(todoData),
          }
        );
      }

      if (response.ok) {
        setTitle("");
        setDescription("");
        setAddTask(false);
        setEditTask(null);
        handleTasks();
      } else {
        console.error("Failed to create task");
      }
    } catch (e) {
      console.error("Error submitting task:", e);
    }
  };

  const handleDelete = async (index: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/task/${tasks[index].id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        console.error("Failed to delete task");
      }
      handleTasks();
    } catch (e) {
      console.error("Error deleting task:", e);
    }
  };

  useEffect(() => {
    handleTasks();
  }, []);

  return (
    <>
      <div className="container mx-auto px-3">
        <div className="pt-10 pb-3 text-neutral-900">
          <h1 className="font-bold text-3xl mb-2">TODO APP</h1>
          <div className="flex justify-between md:items-center flex-col md:flex-row">
            <p className="max-w-sm sm:max-w-lg mb-3 md:mb-0">
              Todo app is an application where you can manage your daily
              schedule, such as for studying, reminders, and many other things
            </p>
            <div className="">
              <button
                onClick={handleCreate}
                className="bg-blue-500 hover:bg-blue-700 text-white rounded-md px-4 py-2"
              >
                + Add Task
              </button>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col md:flex-row gap-3">
          <div
            className={`w-full min-h-[308px] ${
              addTask ? "md:w-2/3 order-2 md:order-1" : ""
            } bg-neutral-300 p-3 rounded-md`}
          >
            <div className="flex flex-col gap-3">
              {tasks.map((task, index) => (
                <div className="bg-neutral-100 rounded-lg p-3" key={index}>
                  <div className="flex gap-3 justify-between">
                    <div className="">
                      <h2 className="text-2xl font-semibold border-b-2">
                        {task.title}
                      </h2>
                      <p>{task.description}</p>
                    </div>
                    <div className="">
                      <img
                        src={edit}
                        alt=""
                        className="w-5 h-5 mb-3 cursor-pointer"
                        onClick={() => handleEdit(index)}
                      />
                      <img
                        src={trash}
                        alt=""
                        className="w-5 h-5 cursor-pointer"
                        onClick={() => handleDelete(index)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {addTask && (
            <div
              className={`w-full md:w-1/3 ${
                addTask ? "order-1 md:order-2" : ""
              }`}
            >
              <div className="border-2 rounded-md p-4">
                <div className="flex flex-col gap-3">
                  <h1 className="font-bold text-2xl">
                    {editTask == null ? "Add New Task" : "Edit Task"}
                  </h1>
                  <input
                    type="text"
                    name="title"
                    placeholder="title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-neutral-200 px-3 py-2 rounded-md outline-none"
                  />
                  <textarea
                    name="description"
                    id="description"
                    className="bg-neutral-200 px-3 py-2 h-32 rounded-md outline-none"
                    placeholder="description..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                  <div className="flex justify-end">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 px-4 py-1.5 text-white rounded-md"
                      onClick={handleSubmit}
                    >
                      {editTask == null ? "Create Task" : "Update Task"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
