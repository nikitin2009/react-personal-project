// Test module
import { api } from "../api";

// Test utilities
import { BaseTaskModel } from "../../instruments";

describe("Инрфаструктурный модуль api:", () => {
    describe("должен иметь асинхронный метод fetchTasks", () => {
        afterAll(() => {
            jest.clearAllMocks();
        });

        test("должен отослать fetch—запрос", () => {
            api.fetchTasks();
            expect(fetch).toHaveBeenCalledTimes(1);
        });

        test("при ответе API со статусом 200 — должен вернуть данные, предоставленные API", async () => {
            await expect(api.fetchTasks()).resolves.toEqual([]);
        });
    });

    describe("должен иметь асинхронный метод createTask", () => {
        afterAll(() => {
            jest.clearAllMocks();
        });

        test("должен отослать fetch—запрос", () => {
            api.createTask();
            expect(fetch).toHaveBeenCalledTimes(1);
        });

        test("при ответе API со статусом 200 — должен вернуть данные, предоставленные API", async () => {
            await expect(api.createTask()).resolves.toEqual([]);
        });
    });

    describe("должен иметь асинхронный метод updateTask", () => {
        afterAll(() => {
            jest.clearAllMocks();
        });

        test("должен отослать fetch—запрос", () => {
            api.updateTask();
            expect(fetch).toHaveBeenCalledTimes(1);
        });

        test("при ответе API со статусом 200 — должен вернуть данные, предоставленные API", async () => {
            await expect(api.createTask()).resolves.toEqual([]);
        });
    });

    describe("должен иметь асинхронный метод removeTask", () => {
        beforeAll(() => {
            global.fetchResponse.status = 204;
        });

        afterAll(() => {
            jest.clearAllMocks();
            global.fetchResponse.status = 200;
        });

        test("должен отослать fetch—запрос", async () => {
            await api.removeTask();
            expect(fetch).toHaveBeenCalledTimes(1);
        });

        test("при ответе API со статусом 204 — должен разрешиться без ошибок", async () => {
            await expect(api.removeTask()).resolves.toBeUndefined();
        });
    });

    describe("должен иметь асинхронный метод completeAllTasks", () => {
        afterAll(() => {
            jest.clearAllMocks();
        });

        const tasks = [...Array(10).keys()].map(() => {
            return new BaseTaskModel();
        });

        test("должен отослать принимать массив задач аргументов, и высылать по fetch—запросу на каждую задачу в массиве. нужно использовать Promise.all", () => {
            api.completeAllTasks(tasks);

            expect(fetch).toHaveBeenCalledTimes(10);
        });

        test("если ответы на все запросы к API вернулись со статусом 200 — должен разрешиться без ошибок", async () => {
            global.fetchResponseData = tasks;
            await expect(api.completeAllTasks(tasks)).resolves.toBeUndefined();
            global.fetchResponseData = "Data provided by API.";
        });
    });
});
