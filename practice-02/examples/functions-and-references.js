"use strict";

console.log("Эксперимент 1. Аргументы функции и типы");
function sum(a, b) { return a + b; }
console.log("sum(2, 3):", sum(2, 3), "тип:", typeof sum(2, 3));
console.log('sum("2", 3):', sum("2", 3), "тип:", typeof sum("2", 3));

console.log("\nЭксперимент 2. Возвращаемое значение стрелочной функции");
const brokenSquare = (value) => { value * value; };
console.log("До исправления square(4):", brokenSquare(4)); // undefined: нет return
const square = (value) => { return value * value; };
console.log("После исправления square(4):", square(4));

console.log("\nЭксперимент 3. Ссылка на объект");
const originalUser = { name: "Анна" };
const sameUser = originalUser;
sameUser.name = "Мария";
console.log("originalUser:", originalUser);
console.log("Один объект:", originalUser === sameUser);

console.log("\nЭксперимент 4. Копирование массива объектов через spread");
const sourceItems = [{ id: 1, label: "План" }, { id: 2, label: "Слайды" }];
const copiedItems = [...sourceItems];
copiedItems.push({ id: 3, label: "Вопросы" });
copiedItems[0].label = "Обновлённый план";
console.log("Длина исходного массива:", sourceItems.length);
console.log("Длина копии:", copiedItems.length);
console.log("Общий вложенный объект изменён:", sourceItems[0].label);
console.log("Массивы — разные объекты:", sourceItems !== copiedItems);

console.log("\nЭксперимент 5. Spread объекта и повторное свойство");
const task = { id: 5, title: "Черновик", completed: false };
const renamedTask = { ...task, title: "Проверенный черновик" };
console.log("Исходная задача:", task);
console.log("Копия:", renamedTask);
console.log("Верхние объекты разные:", task !== renamedTask);

console.log("\nЭксперимент 6. Параметр по умолчанию");
function describePriority(priority = "medium") { return priority; }
console.log("Без аргумента:", describePriority());
console.log("undefined:", describePriority(undefined));
console.log("null:", describePriority(null));
console.log('Пустая строка:', JSON.stringify(describePriority("")));
