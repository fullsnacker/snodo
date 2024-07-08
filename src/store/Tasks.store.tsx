import {
  Action,
  createSlice,
  Dispatch,
  MiddlewareAPI,
  PayloadAction,
} from "@reduxjs/toolkit";
import { Task } from "../interfaces";

const defaultTasks2: Task[] = [];

const defaultTasks: Task[] = [
  {
    title: "Node 54",
    important: false,
    description: "Transformar objeto a un arreglo - Detalles estéticos",
    date: "2024-07-09",
    dir: "Udemy",
    completed: false,
    id: "t1",
  },
  {
    title: "Node 55",
    important: false,
    description: "Guardar tareas en un archivo de texto",
    date: "2024-07-09",
    dir: "Udemy",
    completed: false,
    id: "t2",
  },
  {
    title: "Node 56",
    important: false,
    description: "Leer nuestra base de datos",
    date: "2024-07-09",
    dir: "Udemy",
    completed: false,
    id: "t3",
  },
  {
    title: "Node 57",
    important: false,
    description: "Tarea - Cargar tareas",
    date: "2024-07-09",
    dir: "Udemy",
    completed: false,
    id: "t4",
  },
  {
    title: "Node 58",
    important: false,
    description: "Listar tareas",
    date: "2024-07-09",
    dir: "Udemy",
    completed: false,
    id: "t5",
  },
  {
    title: "Node 59",
    important: false,
    description: "Tareas completadas y pendientes - opciones del menú",
    date: "2024-07-09",
    dir: "Udemy",
    completed: false,
    id: "t6",
  },
  {
    title: "Node 60",
    important: false,
    description: "Listado para borrar",
    date: "2024-07-09",
    dir: "Udemy",
    completed: false,
    id: "t7",
  },
  {
    title: "Node 61",
    important: false,
    description: "Confirmar y borrar tarea",
    date: "2024-07-09",
    dir: "Udemy",
    completed: false,
    id: "t8",
  },
  {
    title: "Node 62",
    important: false,
    description: "Múltiples selecciones",
    date: "2024-07-09",
    dir: "Udemy",
    completed: false,
    id: "t9",
  },
  {
    title: "Node 63",
    important: false,
    description: "Marcar como completadas o pendientes las tareas",
    date: "2024-07-09",
    dir: "Udemy",
    completed: false,
    id: "t10",
  },
];

const getSavedDirectories = (): string[] => {
  let dirList: string[] = [];
  if (localStorage.getItem("directories")) {
    dirList = JSON.parse(localStorage.getItem("directories")!);
    const mainDirExists = dirList.some((dir: string) => dir === "Main");
    if (!mainDirExists) {
      dirList.push("Main");
    }
  } else {
    dirList.push("Main");
  }

  if (localStorage.getItem("tasks")) {
    const savedTasksList = JSON.parse(localStorage.getItem("tasks")!);
    const dirNotSaved: string[] = [];
    savedTasksList.forEach((task: Task) => {
      if (!dirList.includes(task.dir)) {
        if (!dirNotSaved.includes(task.dir)) {
          dirNotSaved.push(task.dir);
        }
      }
    });
    dirList = [...dirList, ...dirNotSaved];
  }
  return dirList;
};

const initialState: {
  tasks: Task[];
  directories: string[];
} = {
  tasks: localStorage.getItem("tasks")
    ? JSON.parse(localStorage.getItem("tasks")!)
    : defaultTasks,
  directories: getSavedDirectories(),
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState: initialState,
  reducers: {
    addNewTask(state, action: PayloadAction<Task>) {
      state.tasks = [action.payload, ...state.tasks];
    },
    removeTask(state, action) {
      const newTasksList = state.tasks.filter(
        (task) => task.id !== action.payload
      );
      state.tasks = newTasksList;
    },
    markAsImportant(state, action: PayloadAction<string>) {
      const newTaskFavorited = state.tasks.find(
        (task) => task.id === action.payload
      );
      newTaskFavorited!.important = !newTaskFavorited!.important;
    },
    editTask(state, action: PayloadAction<Task>) {
      const taskId = action.payload.id;

      const newTaskEdited: Task = state.tasks.find(
        (task: Task) => task.id === taskId
      )!;
      const indexTask = state.tasks.indexOf(newTaskEdited);
      state.tasks[indexTask] = action.payload;
    },
    toggleTaskCompleted(state, action: PayloadAction<string>) {
      const taskId = action.payload;

      const currTask = state.tasks.find((task) => task.id === taskId)!;

      currTask.completed = !currTask.completed;
    },
    deleteAllData(state) {
      state.tasks = [];
      state.directories = ["Main"];
    },
    createDirectory(state, action: PayloadAction<string>) {
      const newDirectory: string = action.payload;
      const directoryAlreadyExists = state.directories.includes(newDirectory);
      if (directoryAlreadyExists) return;
      state.directories = [newDirectory, ...state.directories];
    },
    deleteDirectory(state, action: PayloadAction<string>) {
      const dirName = action.payload;

      state.directories = state.directories.filter((dir) => dir !== dirName);
      state.tasks = state.tasks.filter((task) => task.dir !== dirName);
    },
    editDirectoryName(
      state,
      action: PayloadAction<{ newDirName: string; previousDirName: string }>
    ) {
      const newDirName: string = action.payload.newDirName;
      const previousDirName: string = action.payload.previousDirName;
      const directoryAlreadyExists = state.directories.includes(newDirName);
      if (directoryAlreadyExists) return;

      const dirIndex = state.directories.indexOf(previousDirName);

      state.directories[dirIndex] = newDirName;
      state.tasks.forEach((task) => {
        if (task.dir === previousDirName) {
          task.dir = newDirName;
        }
      });
    },
  },
});

export const tasksActions = tasksSlice.actions;
export default tasksSlice.reducer;

export const tasksMiddleware =
  (store: MiddlewareAPI) => (next: Dispatch) => (action: Action) => {
    const nextAction = next(action);
    const actionChangeOnlyDirectories =
      tasksActions.createDirectory.match(action);

    const isADirectoryAction: boolean = action.type
      .toLowerCase()
      .includes("directory");

    if (action.type.startsWith("tasks/") && !actionChangeOnlyDirectories) {
      const tasksList = store.getState().tasks.tasks;
      localStorage.setItem("tasks", JSON.stringify(tasksList));
    }
    if (action.type.startsWith("tasks/") && isADirectoryAction) {
      const dirList = store.getState().tasks.directories;
      localStorage.setItem("directories", JSON.stringify(dirList));
    }

    if (tasksActions.deleteAllData.match(action)) {
      localStorage.removeItem("tasks");
      localStorage.removeItem("directories");
      localStorage.removeItem("darkmode");
    }

    if (tasksActions.removeTask.match(action)) {
      console.log(JSON.parse(localStorage.getItem("tasks")!));
      if (localStorage.getItem("tasks")) {
        const localStorageTasks = JSON.parse(localStorage.getItem("tasks")!);
        if (localStorageTasks.length === 0) {
          localStorage.removeItem("tasks");
        }
      }
    }
    return nextAction;
  };
