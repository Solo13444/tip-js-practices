import { demoTasks, variantNumber, variantTasks } from "./data.js";
import {
  addTask,
  findTaskById,
  getPendingTasks,
  getTaskStats,
  getTaskTitles,
  removeTask,
  renameTask,
  setTaskCompleted,
} from "./task-service.js";

function printSummary(label, tasks) {
  const { total, completed, pending, progress } = getTaskStats(tasks);
  console.log(`${label}: всего ${total}; выполнено ${completed}; осталось ${pending}; прогресс ${progress.toFixed(1)}%`);
}

function applyResult(currentTasks, result, label) {
  if (!result.ok) {
    console.log(`${label}: ошибка — ${result.error}`);
    return currentTasks;
  }
  printSummary(label, result.tasks);
  return result.tasks;
}

console.log("=== Общий демонстрационный набор ПР2 ===");
console.log("Исходные задачи:", demoTasks);
console.log("Названия:", getTaskTitles(demoTasks));
console.log("Невыполненные задачи:", getPendingTasks(demoTasks));
printSummary("Исходная сводка", demoTasks);

let currentTasks = demoTasks;
currentTasks = applyResult(currentTasks, addTask(currentTasks, 20, "Добавить проверку", "high"), "После добавления id=20");
currentTasks = applyResult(currentTasks, setTaskCompleted(currentTasks, 4, true), "После завершения id=4");
currentTasks = applyResult(currentTasks, renameTask(currentTasks, 10, "Подготовить инструкцию запуска"), "После переименования id=10");
currentTasks = applyResult(currentTasks, removeTask(currentTasks, 7), "После удаления id=7");
currentTasks = applyResult(currentTasks, addTask(currentTasks, 20, "Повтор", "low"), "Повторное добавление id=20");
console.log("Исходный demoTasks не изменён:", demoTasks);

console.log(`\n=== Индивидуальный вариант ${variantNumber}: подготовка семинара ===`);
console.log("Исходные задачи варианта:", variantTasks);
printSummary("Исходная сводка варианта", variantTasks);
let seminarTasks = variantTasks;
seminarTasks = applyResult(seminarTasks, addTask(seminarTasks, 80, "Подготовить раздаточные материалы", "high"), "Добавление id=80");
seminarTasks = applyResult(seminarTasks, setTaskCompleted(seminarTasks, 11, true), "Проверка статуса id=11");
seminarTasks = applyResult(seminarTasks, renameTask(seminarTasks, 23, "Собрать и проверить список источников"), "Переименование id=23");
seminarTasks = applyResult(seminarTasks, removeTask(seminarTasks, 37), "Удаление id=37");
seminarTasks = applyResult(seminarTasks, addTask(seminarTasks, 80, "Дубликат", "high"), "Проверка дубликата id=80");
console.log("Итоговые id варианта:", seminarTasks.map((task) => task.id));
console.log("Исходный набор варианта сохранён:", variantTasks.map((task) => task.id), "; id=23:", findTaskById(variantTasks, 23)?.title);
