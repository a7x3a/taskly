import { useStates } from "../Context/Context";
import { CiSearch } from "react-icons/ci";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useRef, useState, useEffect } from "react";
import { MdOutlineEdit } from "react-icons/md";
import { MdFileDownloadDone } from "react-icons/md";
import { IoReload } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { getConfig } from "../config/config";
import axios from "axios";
import { waveform } from 'ldrs'
waveform.register()
const Home = () => {
  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  //API url getting
  const { API_URL } = getConfig();
  const url = `${API_URL}/notes/`; //get Notes by Session _id
  const add_note = `${API_URL}/notes/add`; //add notes { title, content, categorie }
  const delete_note = `${API_URL}/notes/delete`; //request.body.noteId && session.user._id
  const update_note = `${API_URL}/notes/update`; //{ _id, title, content, categorie }
  const complete_task = `${API_URL}/notes/complete`; //set completed state
  //Refs
  const task_title = useRef();
  const task_dics = useRef();
  const task_catg = useRef();
  //State Mangments
  const { state } = useStates();
  //States
  const [titleDialog, setTitleDialog] = useState(false);
  const [catgDialog, setCatgDialog] = useState(false);
  const [dicsDialog, setDiscDialog] = useState(false);
  const [searchInput, setSearchInput] = useState(false);
  const [categorized, setCategorized] = useState(false);
  const [tasksData, setTasksData] = useState([]);
  const [oldTasksData, setOldTasksData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [categorizedButton, setCategorizedButton] = useState(null);
  const [categorizedButtons, setCategorizedButtons] = useState([
    "pending",
    "compeleted",
  ]);

  //Handling Search
  const handleSearch = (e) => {
    const searchValue = e.target.value.trim().toLowerCase();
    if (!searchValue) {
      setTasksData(oldTasksData);
    } else {
      const filteredTasks = oldTasksData.filter((task) =>
        task.title.toLowerCase().includes(searchValue)
      );
      setTasksData(filteredTasks);
    }
  };

  //Handling AddTasks
  const handleAddTask = async (e) => {
    e.preventDefault();
    const title = task_title.current.value;
    const content = task_dics.current.value;
    const categorie = task_catg.current.value;

    try {
      const response = await axios.post(
        add_note,
        {
          title,
          content,
          categorie,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // Include credentials such as cookies
        }
      );
      setTasksData([...tasksData, response.data]);
    } catch (error) {
      console.log("Something went wrong!");
    }
    //To Close The Modal
    document.getElementById("addTask").close();
    task_title.current.value = null;
    task_dics.current.value = null;
    task_catg.current.value = null;
  };

  //handleRemove Tasks
  const handleRemoveTask = async (noteId) => {
    setLoader(true);
    try {
      const response = await axios.delete(delete_note, {
        data: { noteId },
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      setTasksData(tasksData.filter((task) => task._id !== noteId));
      setLoader(false);
    } catch (error) {
      console.log("Something went wrong!", error);
      setLoader(false);
    }
  };

  //Handle Sotring By Catg Buttons
  const handleCategorizedButtons = (button) => {
    const searchValue = typeof button === "string" ? button.toLowerCase() : "";
    if (searchValue === "compeleted") {
      const filteredTasks = oldTasksData.filter((task) => task.completed);
      setTasksData(filteredTasks);
    } else if (searchValue === "pending") {
      const filteredTasks = oldTasksData.filter((task) => !task.completed);
      setTasksData(filteredTasks);
    } else {
      setTasksData(filteredTasks);
    }
  };

  //Handling Set Complete Stats
  const handleCompleteTask = async (noteId) => {
    setLoader(true);
    try {
      const updatedTasksData = tasksData.map((task) => {
        if (task._id === noteId) {
          return { ...task, completed: !task.completed };
        }
        return task;
      });
      setTasksData(updatedTasksData);
      setOldTasksData(updatedTasksData);
      const response = await axios.put(
        complete_task,
        {
          noteId: noteId,
          completed: updatedTasksData.find((task) => task._id === noteId)
            .completed,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setLoader(false);
    } catch (error) {
      console.error("Error updating task:", error);
      setLoader(false);
    }
    fetchData();
  };

  //Handling Edit Tasks
  const handleEditTask = async (_id) => {
    try {
      const updatedTask = tasksData.find((task) => task._id === _id);
      const updatedData = {
        _id: _id,
        title: titleDialog || updatedTask.title,
        categorie: catgDialog || updatedTask.categorie,
        content: dicsDialog || updatedTask.content,
      };
      const response = await axios.put(update_note, updatedData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (response.status === 200) {
        const updatedTasksData = tasksData.map((task) => {
          if (task._id === _id) {
            return {
              ...task,
              title: updatedData.title,
              categorie: updatedData.categorie,
              content: updatedData.content,
            };
          }
          return task;
        });

        setTasksData(updatedTasksData);
        setOldTasksData(updatedTasksData);
      } else {
        console.error("Error updating task:", response.data);
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
    setCatgDialog(null);
    setTitleDialog(null);
    setDiscDialog(null);
    document.getElementById(`${_id}/update`).close();
  };

  //Use Effect to get notes
  const fetchData = async () => {
    setLoader(true);
    try {
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // Include credentials such as cookies
      });

      setTasksData(response.data); // Update tasksData with fetched data
      setOldTasksData(response.data);
      setLoader(false);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setLoader(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div
      data-theme={state.mode}
      className="max-w-full  h-fit mt-3 rounded-lg font-mono p-10 flex flex-col"
    >
      <div className="w-full flex flex-col  items-center gap-3">
        <div className="w-full grid grid-cols-6 gap-2">
          {/**Form Hidden Until Click Add Task then Modal */}
          <button
            onClick={() => document.getElementById("addTask").showModal()}
            className="btn btn-block col-span-5"
          >
            Add Task
          </button>
          <dialog id="addTask" className="modal ">
            <div className="modal-box w-3/4 h-fit">
              <form
                onSubmit={handleAddTask}
                id="addTask"
                className="h-fit  w-full flex flex-col gap-3"
              >
                <h3>Add Your Tasks</h3>
                <input
                  type="text"
                  ref={task_title}
                  className="input input-bordered capitalize"
                  placeholder="Enter Your Task"
                  name="task"
                  required
                />
                <input
                  type="text"
                  ref={task_catg}
                  className="input input-bordered capitalize"
                  placeholder="Enter the Category"
                  name="Category"
                />
                <textarea
                  ref={task_dics}
                  type="text"
                  className="textarea textarea-bordered h-[100px]"
                  placeholder="Enter the Description"
                  name="taskDescription"
                  required
                />

                <button type="submit" className="btn">
                  Add
                </button>
              </form>
              <div className="modal-action w-full">
                <form method="dialog" className="w-full">
                  <button className="btn btn-block btn-error text-white">
                    Close
                    <IoMdClose size={20} />
                  </button>
                </form>
              </div>
            </div>
          </dialog>

          {/**Search handling */}
          <button
            onClick={() => {
              setSearchInput((prev) => !prev);
              searchInput && setTasksData(oldTasksData);
              document.getElementById("search_input").value = "";
            }}
            className="btn btn-block btn-square col-span-1"
          >
            {!searchInput ? (
              <CiSearch size={20} />
            ) : (
              <IoIosCloseCircleOutline size={20} />
            )}
          </button>
        </div>
        <div className="w-full flex">
          <input
            onChange={handleSearch}
            type="text"
            className={`input input-bordered w-full  ${
              searchInput ? "block" : "hidden"
            }`}
            placeholder="Search Tasks.."
            id="search_input"
          />
        </div>

        {/**Catg Handling */}
        <div className="w-full">
          <button
            onClick={() => {
              setCategorized((prev) => !prev);
              {
                categorized && setTasksData(oldTasksData);
              }
            }}
            className="btn btn-block "
          >
            Status {categorized && <IoIosCloseCircleOutline size={20} />}
          </button>
        </div>
        <div
          className={`grid w-full py-3 grid-cols-2 row-auto gap-3 ${
            categorized ? "grid" : "hidden"
          }`}
        >
          {categorizedButtons.map((button, index) => {
            return (
              <button
                key={index}
                onClick={() => {
                  handleCategorizedButtons(button);
                  categorizedButton === button
                    ? setCategorizedButton(null)
                    : setCategorizedButton(button);
                  categorizedButton === button && setTasksData(oldTasksData);
                }}
                className={`btn  text-xs btn-neutral ${
                  state.mode === "dark" ? "text-white" : "text-gray-100"
                } ${categorizedButton === button && "btn-success"}`}
              >
                {categorizedButton === button ? (
                  <IoIosCloseCircleOutline size={22} />
                ) : (
                  button
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/**Task title */}
      <div className="w-full text-center text-xl font-bold btn bg-gradient-to-br from-pink-300 to-blue-300  active:!scale-100 !text-white mt-4 uppercase tracking-widest cursor-default ">
        Tasks
      </div>

      {loader ? (
        <div className="w-full h-[100px] flex justify-center items-center">
          <l-waveform
  size="35"
  stroke="3.5"
  speed="1" 
  color="gray" 
></l-waveform>
        </div>
      ) : (
        <div className="max-w-full  h-fit mt-5 rounded-lg grid gap-3">
          {/**Each Task Rep */}
          {tasksData.map((task, index) => {
            return (
              <div
                key={index}
                className="w-full rounded-lg grid grid-cols-7 row-auto gap-3 "
              >
                {/**Data Handling With Dialog */}
                <div
                  onClick={() => document.getElementById(task._id).showModal()}
                  className={`btn btn-block rounded-lg col-span-4 overflow-hidden flex justify-between ${
                    task.completed ? "line-through btn-disabled " : null
                  }`}
                >
                  {task.title}
                  {task.completed && "   --- COMPLETED"}
                </div>

                <dialog id={task._id} className="modal w-full ">
                  <div className="modal-box w-3/4 h-fit  flex flex-col gap-2">
                    <div>Task :</div>
                    <div className="text-lg btn  btn-outline active:!scale-100 text-start font-bold overflow-x-auto px-3 pl-5  capitalize ">
                      {task.title ? task.title : ""}
                    </div>

                    <div className="btn  btn-outline active:!scale-100 text-start  font-light">
                      {task.content ? task.content : ""}
                    </div>
                    <div className="btn  btn-outline active:!scale-100 text-start  font-light">
                      Category : {task.categorie ? task.categorie : ""}
                    </div>
                    <div className=" btn-outline active:!scale-100 text-start  btn ">
                      Created at :
                      {" " +
                        new Date(task.createdAt).toLocaleDateString(
                          undefined,
                          options
                        )}
                    </div>
                    <div className="modal-action w-full">
                      <form method="dialog" className="w-full">
                        <button className="btn btn-block">Close</button>
                      </form>
                    </div>
                  </div>
                </dialog>

                {/**Update task Handling With Dialog */}
                <button
                  onClick={() =>
                    document.getElementById(`${task._id}/update`).showModal()
                  }
                  className={`btn btn-block col-span-1 btn-square btn-info text-white ${
                    task.completed ? "line-through btn-disabled " : null
                  }`}
                >
                  <MdOutlineEdit size={20} />
                </button>
                <dialog id={`${task._id}/update`} className="modal">
                  <div className="modal-box flex flex-col gap-3">
                    <h3 className="font-bold capitalize text-lg text-center p-4 ">
                      Update Task
                    </h3>

                    <form
                      onSubmit={() => {
                        handleEditTask(task._id);
                      }}
                      method="dialog"
                      className="flex flex-col gap-3"
                    >
                      <input
                        type="text"
                        onChange={(e) => {
                          setTitleDialog(e.target.value);
                        }}
                        className="input w-full input-bordered"
                        placeholder="Change Title"
                        defaultValue={task.title ? task.title : ""}
                        required
                      />
                      <input
                        type="text"
                        onChange={(e) => {
                          setCatgDialog(e.target.value);
                        }}
                        className="input w-full input-bordered"
                        placeholder="Change Category"
                        defaultValue={task.categorie ? task.categorie : ""}
                      />
                      <textarea
                        onChange={(e) => {
                          setDiscDialog(e.target.value);
                        }}
                        type="text"
                        className="textarea textarea-bordered h-[100px]"
                        placeholder="Change Description"
                        name="ChangeDescription"
                        defaultValue={task.content ? task.content : ""}
                        required
                      />

                      <button
                        type="submit"
                        className="btn btn-block btn-error text-white"
                      >
                        Save
                      </button>
                    </form>
                    <button
                      onClick={() => {
                        document.getElementById(`${task._id}/update`).close();
                      }}
                      className="btn btn-block btn-accent text-white"
                    >
                      Cancel
                    </button>
                  </div>
                </dialog>
                {/**Complete Task Handling With Dialog */}
                <button
                  onClick={() => {
                    handleCompleteTask(task._id);
                  }}
                  className={`btn btn-block col-span-1 btn-square ${
                    task.completed ? "btn-warning" : "btn-success"
                  } text-white`}
                >
                  {task.completed ? (
                    <IoReload size={20} />
                  ) : (
                    <MdFileDownloadDone size={20} />
                  )}
                </button>

                {/**Delete Handling With Dialog */}
                <button
                  onClick={() =>
                    document.getElementById(`${task._id}/remove`).showModal()
                  }
                  className="btn btn-block col-span-1 btn-square btn-error text-white"
                >
                  <MdDeleteOutline size={20} />
                </button>
                <dialog id={`${task._id}/remove`} className="modal">
                  <div className="modal-box">
                    <h3 className="font-bold capitalize text-lg text-center p-4">
                      Do you want to delete this task?
                    </h3>
                    <form method="dialog" className="flex flex-col gap-3">
                      <button
                        onClick={() => {
                          handleRemoveTask(task._id);
                        }}
                        className="btn btn-block btn-error text-white"
                      >
                        Confirm
                      </button>
                      <button className="btn btn-block btn-accent text-white">
                        Cancel
                      </button>
                    </form>
                  </div>
                </dialog>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Home;
