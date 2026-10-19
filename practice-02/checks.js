import assert from "node:assert/strict";
import { demoTasks, variantTasks, variantNumber } from "./src/data.js";
import {
  createTask, findTaskById, getPendingTasks, getTaskTitles, getTaskStats,
  addTask, setTaskCompleted, renameTask, removeTask,
} from "./src/task-service.js";

let passed = 0;
function check(name, fn) {
  try {
    fn();
    passed += 1;
    console.log(`✓ ${name}`);
  } catch (error) {
    console.error(`✗ ${name}: ${error.message}`);
    process.exitCode = 1;
  }
}

check("Вариант 4 и шесть задач с предписанными id", () => {
  assert.equal(variantNumber, 4);
  assert.deepEqual(variantTasks.map((task) => task.id), [11, 23, 37, 41, 58, 64]);
  assert.equal(getTaskStats(variantTasks).completed, 3);
  assert.deepEqual(new Set(variantTasks.map((task) => task.priority)), new Set(["low", "medium", "high"]));
});
check("createTask создаёт корректную задачу", () => {
  assert.deepEqual(createTask(20, "Новая задача", "high"), {
    ok: true, task: { id: 20, title: "Новая задача", completed: false, priority: "high" },
  });
});
check("Приоритет по умолчанию medium", () => assert.equal(createTask(20, "Задача").task.priority, "medium"));
check("undefined использует приоритет по умолчанию", () => assert.equal(createTask(20, "Задача", undefined).task.priority, "medium"));
check("Название обрезает пробелы по краям", () => assert.equal(createTask(20, "  Проверить данные  ").task.title, "Проверить данные"));
check("Название длиной 1 допустимо", () => assert.equal(createTask(1, "x").ok, true));
check("Название длиной 100 допустимо", () => assert.equal(createTask(1, "a".repeat(100)).ok, true));
check("Пустое название отклоняется", () => assert.equal(createTask(1, "").ok, false));
check("Название из пробелов отклоняется", () => assert.equal(createTask(1, "   ").ok, false));
check("Название длиной 101 отклоняется", () => assert.equal(createTask(1, "a".repeat(101)).ok, false));
check("Название нестрокового типа отклоняется без исключения", () => assert.equal(createTask(1, 42).ok, false));
check("Некорректные id отклоняются", () => {
  for (const id of [0, -1, 1.5, "4", NaN, Infinity, null, undefined, Number.MAX_SAFE_INTEGER + 1]) {
    assert.equal(createTask(id, "Задача").ok, false, String(id));
  }
});
check("Максимальный безопасный id допустим", () => assert.equal(createTask(Number.MAX_SAFE_INTEGER, "Задача").ok, true));
check("Приоритет проверяется строго", () => {
  for (const priority of ["urgent", "HIGH", " high ", null, 1]) assert.equal(createTask(1, "Задача", priority).ok, false);
});
check("Повторное создание возвращает разные объекты", () => {
  const first = createTask(2, "Одинаково").task;
  const second = createTask(2, "Одинаково").task;
  assert.deepEqual(first, second);
  assert.notEqual(first, second);
});
check("findTaskById ищет по id, а не по индексу", () => assert.equal(findTaskById(demoTasks, 4).title, "Подготовить модель задач"));
check("Поиск отсутствующего id даёт undefined", () => assert.equal(findTaskById(demoTasks, 777), undefined));
check("Строковый id не совпадает с числовым", () => assert.equal(findTaskById(demoTasks, "4"), undefined));
check("getPendingTasks возвращает [4, 7]", () => assert.deepEqual(getPendingTasks(demoTasks).map((task) => task.id), [4, 7]));
check("getPendingTasks для пустого списка возвращает пустой массив", () => assert.deepEqual(getPendingTasks([]), []));
check("getPendingTasks не возвращает выполненные задачи", () => assert.ok(getPendingTasks(demoTasks).every((task) => task.completed === false)));
check("getTaskTitles сохраняет порядок названий", () => assert.deepEqual(getTaskTitles(demoTasks), ["Изучить функции", "Подготовить модель задач", "Проверить методы массивов", "Оформить README"]));
check("getTaskTitles для пустого списка возвращает []", () => assert.deepEqual(getTaskTitles([]), []));
check("Сводка demoTasks равна 4/2/2/50", () => assert.deepEqual(getTaskStats(demoTasks), { total: 4, completed: 2, pending: 2, progress: 50 }));
check("Сводка пустого списка — нули", () => assert.deepEqual(getTaskStats([]), { total: 0, completed: 0, pending: 0, progress: 0 }));
check("Прогресс для задачи без выполненных — 0", () => assert.equal(getTaskStats(demoTasks.map((task) => ({ ...task, completed: false }))).progress, 0));
check("Прогресс для всех выполненных — 100", () => assert.equal(getTaskStats(demoTasks.map((task) => ({ ...task, completed: true }))).progress, 100));
check("Треть выполненных даёт точное числовое значение", () => assert.ok(Math.abs(getTaskStats([{ completed: true }, { completed: false }, { completed: false }]).progress - 100 / 3) < 1e-10));
check("addTask добавляет запись в конец нового массива", () => {
  const result = addTask(demoTasks, 20, "Добавить проверку", "high");
  assert.equal(result.ok, true);
  assert.equal(result.tasks.length, 5);
  assert.equal(result.tasks[4].id, 20);
  assert.equal(demoTasks.length, 4);
});
check("addTask в пустой список", () => assert.equal(addTask([], 2, "Одна задача").tasks.length, 1));
check("addTask запрещает дублирующий id", () => assert.equal(addTask(demoTasks, 4, "Дубликат").ok, false));
check("addTask отклоняет неверные данные", () => assert.equal(addTask(demoTasks, 21, "", "high").ok, false));
check("setTaskCompleted создаёт новый массив и обновлённый объект", () => {
  const result = setTaskCompleted(demoTasks, 4, true);
  assert.equal(result.ok, true);
  assert.notEqual(result.tasks, demoTasks);
  assert.notEqual(result.tasks[1], demoTasks[1]);
  assert.equal(result.tasks[1].completed, true);
  assert.equal(demoTasks[1].completed, false);
});
check("setTaskCompleted отклоняет не boolean", () => {
  for (const value of ["false", 0, null, undefined, 1]) assert.equal(setTaskCompleted(demoTasks, 4, value).ok, false);
});
check("setTaskCompleted отсутствующей задачи возвращает ошибку", () => assert.equal(setTaskCompleted(demoTasks, 999, true).ok, false));
check("Повторная установка того же статуса успешна и создаёт копию", () => {
  const result = setTaskCompleted(demoTasks, 1, true);
  assert.equal(result.ok, true);
  assert.notEqual(result.tasks[0], demoTasks[0]);
});
check("renameTask нормализует название и сохраняет другие поля", () => {
  const result = renameTask(demoTasks, 10, "  Новое название  ");
  assert.equal(result.ok, true);
  assert.deepEqual(result.tasks[3], { ...demoTasks[3], title: "Новое название" });
  assert.equal(demoTasks[3].title, "Оформить README");
});
check("renameTask отклоняет пустое название и неизвестный id", () => {
  assert.equal(renameTask(demoTasks, 10, " ").ok, false);
  assert.equal(renameTask(demoTasks, 999, "Название").ok, false);
});
check("renameTask повторно на то же название создаёт копию", () => {
  const result = renameTask(demoTasks, 1, demoTasks[0].title);
  assert.equal(result.ok, true);
  assert.notEqual(result.tasks[0], demoTasks[0]);
});
check("removeTask сохраняет порядок остальных id", () => {
  const result = removeTask(demoTasks, 7);
  assert.equal(result.ok, true);
  assert.deepEqual(result.tasks.map((task) => task.id), [1, 4, 10]);
  assert.deepEqual(demoTasks.map((task) => task.id), [1, 4, 7, 10]);
});
check("removeTask поддерживает удаление единственной задачи", () => assert.deepEqual(removeTask([{ id: 1 }], 1).tasks, []));
check("removeTask отсутствующей задачи возвращает ошибку", () => assert.equal(removeTask(demoTasks, 999).ok, false));
check("Изменяющие функции не портят исходные объекты", () => {
  const before = structuredClone(demoTasks);
  addTask(demoTasks, 25, "Ещё одна");
  setTaskCompleted(demoTasks, 4, true);
  renameTask(demoTasks, 10, "Новое имя");
  removeTask(demoTasks, 7);
  assert.deepEqual(demoTasks, before);
});

console.log(`\nИтого: ${passed} проверок пройдено.`);
