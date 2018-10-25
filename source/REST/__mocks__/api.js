// Test utilities
import { BaseTaskModel } from "../../instruments";

export const api = {
    fetchTasks: jest.fn(() => {
        return Promise.resolve([new BaseTaskModel(), new BaseTaskModel()]);
    }),
    createTask: jest.fn((message = void 0) => {
        return Promise.resolve(new BaseTaskModel(void 0, message));
    }),
    updateTask: jest.fn((updatedTask) => {
        return Promise.resolve(updatedTask);
    }),
    removeTask: jest.fn((postId) => {
        return Promise.resolve(postId);
    }),
    completeAllTasks: jest.fn(() => {
        return Promise.resolve();
    }),
};
