const absentElement = document.querySelector("#there-is-no-such-element");
const emptyCollection = document.querySelectorAll(".there-is-no-such-class");
console.log("Эксперимент 1 — отсутствующие элементы:", absentElement, emptyCollection.length);
console.log("null отличается от пустого NodeList; у коллекции есть length.");

const sampleButton = document.querySelector("#add-item");
console.log("Эксперимент 2 — dataset до преобразования:", sampleButton.dataset.taskId, typeof sampleButton.dataset.taskId);
sampleButton.dataset.taskId = "23";
console.log("dataset после задания:", sampleButton.dataset.taskId, typeof sampleButton.dataset.taskId);
console.log("Number(dataset):", Number(sampleButton.dataset.taskId), typeof Number(sampleButton.dataset.taskId));

const list = document.querySelector("#experiment-list");
const initialItems = list.querySelectorAll("li");
let extraItemNumber = 1;
sampleButton.addEventListener("click", () => {
  const item = document.createElement("li");
  item.textContent = `Добавленная запись ${extraItemNumber++}`;
  list.append(item);
  console.log("Эксперимент 3 — initialItems остаётся:", initialItems.length, "; новая коллекция:", list.querySelectorAll("li").length);
});

const title = document.querySelector("#experiment-title");
document.querySelector("#change-title").addEventListener("click", () => {
  title.textContent = '<strong>Заголовок</strong> & "кавычки"';
  console.log("Эксперимент 4 — заголовок является текстом:", title.textContent);
  console.log("Внутри заголовка есть strong?:", Boolean(title.querySelector("strong")));
});

const root = document.querySelector("#experiment-root");
root.addEventListener("click", (event) => {
  console.log("Всплытие на root:", { target: event.target.tagName, currentTarget: event.currentTarget.id, eventPhase: event.eventPhase });
});
root.addEventListener("click", (event) => {
  console.log("Захват на root:", { target: event.target.tagName, currentTarget: event.currentTarget.id, eventPhase: event.eventPhase });
}, true);
document.querySelector("#change-title").addEventListener("click", (event) => {
  console.log("Эксперимент 5 — обработчик кнопки:", { target: event.target.tagName, currentTarget: event.currentTarget.id, eventPhase: event.eventPhase });
});
