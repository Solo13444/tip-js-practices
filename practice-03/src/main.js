import { demoTasks, variantTasks } from "./data.js";
import { findTaskById, removeTask, setTaskCompleted } from "./task-service.js";
import { getVisibleTasks } from "./task-selectors.js";
import { renderEmptyState, renderSummary, renderTaskList } from "./task-view.js";

const taskListElement = document.querySelector("#task-list");
const filterControlsElement = document.querySelector("#filter-controls");
const summaryElement = document.querySelector("#task-summary");
const emptyStateElement = document.querySelector("#empty-state");
const operationMessageElement = document.querySelector("#operation-message");

const isVariantDataset = new URLSearchParams(window.location.search).get("dataset") === "variant";
const initialTasks = isVariantDataset ? variantTasks : demoTasks;
let currentTasks = initialTasks.map((task) => ({ ...task }));
let currentFilter = "all";

function renderApp() {
  const visibleTasks = getVisibleTasks(currentTasks, currentFilter);
  renderTaskList(taskListElement, visibleTasks);
  renderSummary(summaryElement, currentTasks, visibleTasks.length);
  renderEmptyState(emptyStateElement, currentTasks.length, visibleTasks.length);

  for (const button of filterControlsElement.querySelectorAll("button[data-filter]")) {
    const active = button.dataset.filter === currentFilter;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  }
}

function restoreTaskFocus(id, action) {
  const taskButton = taskListElement.querySelector(
    `li[data-task-id="${id}"] button[data-action="${action}"]`,
  );
  if (taskButton) {
    taskButton.focus();
    return;
  }
  filterControlsElement.querySelector(`button[data-filter="${currentFilter}"]`)?.focus();
}

function handleTaskListClick(event) {
  if (!(event.target instanceof Element)) return;
  const button = event.target.closest("button[data-action]");
  if (!button || !taskListElement.contains(button)) return;

  const action = button.dataset.action;
  if (action !== "toggle" && action !== "delete") return;
  const card = button.closest("li[data-task-id]");
  if (!card || !taskListElement.contains(card)) return;

  const id = Number(card.dataset.taskId);
  if (!Number.isSafeInteger(id) || id <= 0) {
    operationMessageElement.textContent = "Не удалось определить корректный идентификатор задачи.";
    return;
  }

  let result;
  if (action === "toggle") {
    const task = findTaskById(currentTasks, id);
    if (!task) {
      operationMessageElement.textContent = `Задача с id ${id} не найдена в текущем списке.`;
      return;
    }
    result = setTaskCompleted(currentTasks, id, !task.completed);
  } else {
    result = removeTask(currentTasks, id);
  }

  if (!result.ok) {
    operationMessageElement.textContent = result.error;
    return;
  }

  currentTasks = result.tasks;
  operationMessageElement.textContent = "";
  renderApp();
  restoreTaskFocus(id, action);
}

function handleFilterClick(event) {
  if (!(event.target instanceof Element)) return;
  const button = event.target.closest("button[data-filter]");
  if (!button || !filterControlsElement.contains(button)) return;

  const requestedFilter = button.dataset.filter;
  if (!["all", "pending", "completed"].includes(requestedFilter)) return;
  currentFilter = requestedFilter;
  operationMessageElement.textContent = "";
  renderApp();
}

taskListElement.addEventListener("click", handleTaskListClick);
filterControlsElement.addEventListener("click", handleFilterClick);
renderApp();
