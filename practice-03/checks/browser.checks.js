import { demoTasks } from "../src/data.js";
import { getVisibleTasks } from "../src/task-selectors.js";
import { createTaskElement, renderEmptyState, renderSummary, renderTaskList } from "../src/task-view.js";

const resultsElement = document.querySelector("#check-results");
const summaryElement = document.querySelector("#check-summary");
let passed = 0;
let failed = 0;

function check(name, callback) {
  const item = document.createElement("li");
  try {
    callback();
    item.textContent = `Пройдено — ${name}`;
    passed += 1;
  } catch (error) {
    item.textContent = `Ошибка — ${name}: ${error.message}`;
    failed += 1;
  }
  resultsElement.append(item);
}

check("Фильтр all возвращает новый массив всех задач", () => {
  const visible = getVisibleTasks(demoTasks, "all");
  if (visible.length !== 4 || visible === demoTasks) throw new Error("Неверный массив");
});
check("Фильтр pending возвращает id 4 и 7", () => {
  const visible = getVisibleTasks(demoTasks, "pending");
  if (visible.map((task) => task.id).join(",") !== "4,7") throw new Error("Неверные id");
});
check("Фильтр completed возвращает id 1 и 10", () => {
  const visible = getVisibleTasks(demoTasks, "completed");
  if (visible.map((task) => task.id).join(",") !== "1,10") throw new Error("Неверные id");
});
check("Карточка имеет обязательные классы и data-task-id", () => {
  const card = createTaskElement(demoTasks[1]);
  if (!card.matches("li.task-card[data-task-id='4']")) throw new Error("Нет li/task-card/data-task-id");
  if (!card.querySelector(".task-title") || !card.querySelector(".task-status") || !card.querySelector(".task-priority")) throw new Error("Не хватает подписи");
  if (!card.querySelector("button[data-action='toggle'] span.action-label")) throw new Error("Нет кнопки статуса");
  if (!card.querySelector("button[data-action='delete'] span.action-label")) throw new Error("Нет кнопки удаления");
});
check("Карточка выводит пользовательское название как текст", () => {
  const card = createTaskElement({ id: 5, title: '<strong>Проверка</strong> & "текст"', completed: false, priority: "low" });
  if (card.querySelector("strong")) throw new Error("Строка неожиданно интерпретирована как HTML");
  if (!card.querySelector(".task-title").textContent.includes("<strong>")) throw new Error("Текст названия не сохранён");
});
check("Повторная отрисовка заменяет список, а не дублирует карточки", () => {
  const list = document.createElement("ul");
  renderTaskList(list, demoTasks);
  renderTaskList(list, demoTasks.slice(0, 1));
  if (list.children.length !== 1 || list.firstElementChild.dataset.taskId !== "1") throw new Error("Список не заменён");
});
check("Выполненная задача имеет класс и aria-pressed=true", () => {
  const card = createTaskElement(demoTasks[0]);
  if (!card.classList.contains("is-completed")) throw new Error("Нет is-completed");
  if (card.querySelector("button[data-action='toggle']").getAttribute("aria-pressed") !== "true") throw new Error("Неверный aria-pressed");
});
check("Сводка содержит числа по всему массиву и видимому списку", () => {
  const summary = document.createElement("section");
  for (const field of ["total", "completed", "pending", "progress", "visible"]) {
    const node = document.createElement("span");
    node.dataset.stat = field;
    summary.append(node);
  }
  renderSummary(summary, demoTasks, 2);
  const value = (field) => summary.querySelector(`[data-stat="${field}"]`).textContent;
  if (value("total") !== "4" || value("completed") !== "2" || value("pending") !== "2" || value("progress") !== "50.0%" || value("visible") !== "2") throw new Error("Неверная сводка");
});
check("Пустой список показывает соответствующее сообщение", () => {
  const message = document.createElement("p");
  renderEmptyState(message, 0, 0);
  if (message.hidden || message.textContent !== "Список задач пуст.") throw new Error("Неверное пустое состояние");
});
check("Пустой результат фильтра отличается от пустого списка", () => {
  const message = document.createElement("p");
  renderEmptyState(message, 4, 0);
  if (message.hidden || message.textContent !== "Нет задач по выбранному фильтру.") throw new Error("Неверное сообщение фильтра");
});
check("При непустом результате пустое сообщение скрывается", () => {
  const message = document.createElement("p");
  renderEmptyState(message, 4, 2);
  if (!message.hidden || message.textContent !== "") throw new Error("Сообщение должно быть скрыто");
});

summaryElement.textContent = `Итог: ${passed} пройдено, ${failed} ошибок.`;
summaryElement.style.fontWeight = "700";
summaryElement.style.color = failed === 0 ? "#166534" : "#991b1b";
