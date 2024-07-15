import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import useCompletedTasks from "../hooks/useCompletedTasks";
import useTodayTasks from "../hooks/useTodayTasks";
import ConfettiExplosion from "react-confetti-explosion";
import { Task } from "../../interfaces";

const TasksDone: React.FC = () => {
  const route = useLocation();
  const directory = route.pathname.split("/")[2];

  const todaysTasks = useTodayTasks();
  const tasks = useAppSelector((state) => state.tasks.tasks);

  const { tasks: todayTasksDone } = useCompletedTasks({
    tasks: todaysTasks,
    done: true,
  });
  const { tasks: allTasksDone } = useCompletedTasks({
    tasks: tasks,
    done: true,
  });

  const [isExploding, setIsExploding] = React.useState(false);

  const [dayDoneTotal, setDayDoneTotal] = useState(0);

  const [dayTotal, setDayTotal] = useState(0);

  const percentageAllTasks = (allTasksDone.length * 100) / tasks.length;

  // const todaysTasksToShow = todaysTasks.slice(0, 3);
  // const showMore = todaysTasks.length > todaysTasksToShow.length;

  const [timeToEnd, setTimeToEnd] = useState(0);

  let todayDoneTime = 0;
  let totalDayTime = 0;

  let taskCount = 0;

  let percentageTodayTasks = 0;

  if (directory) {
    taskCount = todaysTasks.filter(
      (task: Task) => task.dir === directory
    ).length;
    percentageTodayTasks =
      (todayTasksDone.filter((task: Task) => task.dir === directory).length *
        100) /
      todaysTasks.filter((task: Task) => task.dir === directory).length;
  } else {
    taskCount = todaysTasks.length;
    percentageTodayTasks = (todayTasksDone.length * 100) / todaysTasks.length;
  }

  useEffect(() => {
    if (percentageTodayTasks === 100) {
      setIsExploding(true);
    } else {
      setIsExploding(false);
    }
    if (directory) {
      todayTasksDone
        .filter((task: Task) => task.dir === directory)
        .map((task) => (todayDoneTime += task.time));
      todaysTasks
        .filter((task: Task) => task.dir === directory)
        .map((task) => (totalDayTime += task.time));
    } else {
      todayTasksDone.map((task) => (todayDoneTime += task.time));
      todaysTasks.map((task) => (totalDayTime += task.time));
    }
    setDayDoneTotal(todayDoneTime);
    setDayTotal(totalDayTime);
  }, [percentageTodayTasks, directory]);

  useEffect(() => {
    // console.log(directory);
    const newDate = new Date();
    if (newDate.getHours() >= 18) {
      setTimeToEnd(0);
    } else {
      setTimeToEnd(
        (18 - 1 - newDate.getHours()) * 60 + (60 - newDate.getMinutes())
      );
    }
  }, [directory]);

  useEffect(() => {
    //FOR BACKUP DB
    //console.log(localStorage.getItem("tasks")!);
  }, []);

  return (
    <>
      {isExploding && <ConfettiExplosion />}
      {tasks.length !== 0 && (
        <div className="mt-6">
          <div className="mb-2">
            {directory ? <strong>{directory}'s Directory </strong> : ""}
          </div>
          <span className="flex justify-between mb-2">
            <span>
              <strong>All tasks </strong>
            </span>
            {allTasksDone.length}/{tasks.length}
          </span>
          <div className="barProgress">
            <div style={{ width: percentageAllTasks + "%" }}></div>
          </div>
        </div>
      )}
      {taskCount !== 0 && (
        <div className="mt-3">
          <span className="flex justify-between mt-2 mb-2">
            <span>
              <strong>Today Tasks</strong>
            </span>
          </span>
          <span className="flex justify-between mb-2">
            <span>Tasks</span> {(percentageTodayTasks / 100) * taskCount}/
            {taskCount}
          </span>
          <div className="barProgress">
            <div style={{ width: percentageTodayTasks + "%" }}></div>
          </div>
          <span className="flex justify-between mt-2 mb-2">
            <span>Real Time</span> {dayDoneTotal} / {dayTotal}
          </span>
          <div className="barProgress">
            <div style={{ width: (dayDoneTotal * 100) / dayTotal + "%" }}></div>
          </div>
          <span className="flex justify-between mt-2 mb-5">
            <span>Time Left</span> {dayTotal - dayDoneTotal}
          </span>
          <span className="flex justify-between mt-2 mb-5">
            <span>Time To End</span> {timeToEnd}
          </span>
        </div>
      )}

      {todaysTasks.length === 0 && (
        <span className="mt-6 block pt-4 border-t-slate-200 dark:border-t-slate-700/[.3] border-t-2">
          No tasks today
        </span>
      )}

      {/* {todaysTasks.length > 0 && (
        <div className="mt-8">
          <span className="mb-2 block">Today's tasks</span>
          <ul>
            {todaysTasksToShow.map((task) => (
              <li key={task.id} className="py-2 pl-6 text-slate-200 list-item">
                <span>{task.title}</span>
              </li>
            ))}
          </ul>
          {showMore && (
            <Link to="/today" className="pl-6">
              Show more
            </Link>
          )}
        </div>
      )} */}
    </>
  );
};

export default React.memo(TasksDone);
