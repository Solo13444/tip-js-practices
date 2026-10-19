"use strict";

// Индивидуальный вариант 4.
const totalTasks = 20;
const completedTasks = 11;
const dailyLimit = 6;

if (
  typeof totalTasks !== "number" ||
  typeof completedTasks !== "number" ||
  !Number.isFinite(totalTasks) ||
  !Number.isFinite(completedTasks)
) {
  console.log("Ошибка: количество задач должно быть конечными числами.");
} else if (!Number.isInteger(totalTasks) || !Number.isInteger(completedTasks)) {
  console.log("Ошибка: количество задач должно быть целым числом.");
} else if (totalTasks < 0 || completedTasks < 0) {
  console.log("Ошибка: количество задач не может быть отрицательным.");
} else if (totalTasks > 1000 || completedTasks > 1000) {
  console.log("Ошибка: превышена верхняя граница 1000 задач.");
} else if (completedTasks > totalTasks) {
  console.log("Ошибка: выполнено больше задач, чем существует.");
} else if (
  typeof dailyLimit !== "number" ||
  !Number.isFinite(dailyLimit) ||
  !Number.isInteger(dailyLimit) ||
  dailyLimit < 1 ||
  dailyLimit > 1000
) {
  console.log("Ошибка: дневной лимит должен быть целым числом от 1 до 1000.");
} else {
  let remainingTasks = totalTasks - completedTasks;
  let day = 0;
  console.log(`Осталось задач: ${remainingTasks}`);

  while (remainingTasks > 0) {
    day += 1;
    const tasksForToday = Math.min(dailyLimit, remainingTasks);
    remainingTasks -= tasksForToday;
    console.log(`День ${day}: выполнено ${tasksForToday}, осталось ${remainingTasks}`);
  }

  if (day === 0) console.log("Все задачи уже выполнены.");
  console.log(`Потребуется дней: ${day}`);
}
