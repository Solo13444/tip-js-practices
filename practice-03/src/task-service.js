const VALID_PRIORITIES = new Set(["low", "medium", "high"]);

function isValidId(id) {
  return Number.isSafeInteger(id) && id > 0;
}

function validateTitle(title) {
  if (typeof title !== "string") {
    return { ok: false, error: "Название задачи должно быть строкой." };
  }
  const normalizedTitle = title.trim();
  if (normalizedTitle.length < 1 || normalizedTitle.length > 100) {
    return { ok: false, error: "Название должно содержать от 1 до 100 символов." };
  }
  return { ok: true, title: normalizedTitle };
}

function validateIdResult(id) {
  return isValidId(id)
    ? { ok: true }
    : { ok: false, error: "Идентификатор должен быть положительным безопасным целым числом." };
}

export function createTask(id, title, priority = "medium") {
  const idCheck = validateIdResult(id);
  if (!idCheck.ok) return idCheck;

  const titleCheck = validateTitle(title);
  if (!titleCheck.ok) return titleCheck;

  if (!VALID_PRIORITIES.has(priority)) {
    return { ok: false, error: "Приоритет должен быть low, medium или high." };
  }

  return {
    ok: true,
    task: {
      id,
      title: titleCheck.title,
      completed: false,
      priority,
    },
  };
}

export function findTaskById(tasks, id) {
  return tasks.find((task) => task.id === id);
}

export function getPendingTasks(tasks) {
  return tasks.filter((task) => task.completed === false);
}

export function getTaskTitles(tasks) {
  return tasks.map((task) => task.title);
}

export function getTaskStats(tasks) {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed === true).length;
  const pending = total - completed;
  const progress = total > 0 ? (completed / total) * 100 : 0;
  return { total, completed, pending, progress };
}

export function addTask(tasks, id, title, priority = "medium") {
  const idCheck = validateIdResult(id);
  if (!idCheck.ok) return idCheck;
  if (findTaskById(tasks, id)) {
    return { ok: false, error: `Задача с id ${id} уже существует.` };
  }

  const creation = createTask(id, title, priority);
  if (!creation.ok) return creation;
  return { ok: true, tasks: [...tasks, creation.task] };
}

export function setTaskCompleted(tasks, id, completed) {
  const idCheck = validateIdResult(id);
  if (!idCheck.ok) return idCheck;
  if (typeof completed !== "boolean") {
    return { ok: false, error: "Статус completed должен быть логическим значением true или false." };
  }
  if (!findTaskById(tasks, id)) {
    return { ok: false, error: `Задача с id ${id} не найдена.` };
  }

  const nextTasks = tasks.map((task) =>
    task.id === id ? { ...task, completed } : task,
  );
  return { ok: true, tasks: nextTasks };
}

export function renameTask(tasks, id, title) {
  const idCheck = validateIdResult(id);
  if (!idCheck.ok) return idCheck;
  if (!findTaskById(tasks, id)) {
    return { ok: false, error: `Задача с id ${id} не найдена.` };
  }

  const titleCheck = validateTitle(title);
  if (!titleCheck.ok) return titleCheck;

  const nextTasks = tasks.map((task) =>
    task.id === id ? { ...task, title: titleCheck.title } : task,
  );
  return { ok: true, tasks: nextTasks };
}

export function removeTask(tasks, id) {
  const idCheck = validateIdResult(id);
  if (!idCheck.ok) return idCheck;
  if (!findTaskById(tasks, id)) {
    return { ok: false, error: `Задача с id ${id} не найдена.` };
  }

  return { ok: true, tasks: tasks.filter((task) => task.id !== id) };
}
