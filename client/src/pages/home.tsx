import { useState } from "react";

const Home = () => {
  const [addTask, setAddTask] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const handleSubmit = async () => {
    const todoData = {
      title,
      description,
    };

    try {
      const response = await fetch("", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(todoData),
      });

      if (response.ok) {
        console.log("Task successfully created!");
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
          ></div>

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
