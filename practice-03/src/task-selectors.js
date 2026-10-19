export function getVisibleTasks(tasks, filter) {
  if (filter === "all") return [...tasks];
  if (filter === "pending") return tasks.filter((task) => task.completed === false);
  if (filter === "completed") return tasks.filter((task) => task.completed === true);
  return [];
}
