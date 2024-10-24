import { useEffect, useState } from "react";

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

  const handleSubmit = async () => {
    const todoData = {
      title,
      description,
    };

    try {
      const response = await fetch("http://localhost:8000/task/store", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(todoData),
      });

      if (response.ok) {
        setTitle("");
        setDescription("");
        setAddTask(false);
      } else {
        console.error("Failed to create task");
      }
    } catch (e) {
      console.error("Error submitting task:", e);
    }
  };

  useEffect(() => {
    handleTasks();
  }, [handleSubmit]);

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
                onClick={() => setAddTask((prev) => !prev)}
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
            {tasks.map((task, index) => (
              <div className="" key={index}>
                <h2>{task.title}</h2>
                <p>{task.description}</p>
              </div>
            ))}
          </div>

          {addTask && (
            <div
              className={`w-full md:w-1/3 ${
                addTask ? "order-1 md:order-2" : ""
              }`}
            >
              <div className="border-2 rounded-md p-4">
                <div className="flex flex-col gap-3">
                  <h1 className="font-bold text-2xl">Add New Task</h1>
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
                      Create Task
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
