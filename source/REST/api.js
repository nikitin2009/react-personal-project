import { MAIN_URL, TOKEN } from "./config";

export const api = {
    fetchTasks: async () => {
        const response = await fetch(MAIN_URL, {
            method:  "GET",
            headers: {
                authorization: TOKEN,
            },
        });

        if (response.status !== 200) {
            throw new Error("Tasks were not loaded.");
        }

        const { data: tasks } = await response.json();

        return tasks;
    },

    createTask: async (message) => {
        const response = await fetch(MAIN_URL, {
            method:  "POST",
            headers: {
                authorization:  TOKEN,
                "content-type": "application/json",
            },
            body: JSON.stringify({ message }),
        });

        if (response.status !== 200) {
            throw new Error("Task was not created.");
        }

        const { data: task } = await response.json();

        return task;
    },

    updateTask: async (task) => {
        const response = await fetch(MAIN_URL, {
            method:  "PUT",
            headers: {
                authorization:  TOKEN,
                "content-type": "application/json",
            },
            body: JSON.stringify([task]),
        });

        if (response.status !== 200) {
            throw new Error("Task was not updated.");
        }

        const { data: updatedTasksArr } = await response.json();
        const updatedTask = updatedTasksArr[0];

        return updatedTask;
    },

    completeAllTasks: async (tasks) => {
        await Promise.all(
            tasks.map((task) => {
                task.completed = true;

                return fetch(MAIN_URL, {
                    method:  "PUT",
                    headers: {
                        authorization:  TOKEN,
                        "content-type": "application/json",
                    },
                    body: JSON.stringify([task]),
                });
            })
        ).catch((error) => {
            console.log(error);
        });
    },

    removeTask: async (taskId) => {
        const response = await fetch(`${MAIN_URL}/${taskId}`, {
            method:  "DELETE",
            headers: {
                authorization: TOKEN,
            },
        });

        if (response.status !== 204) {
            throw new Error("Task was not removed.");
        }
    },
};
