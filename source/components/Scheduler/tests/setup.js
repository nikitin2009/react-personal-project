// Core
import React from "react";
import { mount } from "enzyme";

// Test component
import Scheduler from "../";

const testMessage1 = "Выполнить важную задачу.";
const testMessage2 = "Выполнить важную задачу срочно!";

// Mocks
const mocks = {
    preventDefaultMock: jest.fn(),
};

const initialState = {
    newTaskMessage:  "",
    tasksFilter:     "",
    isTasksFetching: false,
    tasks:           [],
};

const result = mount(<Scheduler />);

// Spies
const spies = {
    _updateTasksFilterSpy:    jest.spyOn(result.instance(), "_updateTasksFilter"),
    _updateNewTaskMessageSpy: jest.spyOn(
        result.instance(),
        "_updateNewTaskMessage"
    ),
    _getAllCompletedSpy:       jest.spyOn(result.instance(), "_getAllCompleted"),
    _setTasksFetchingStateSpy: jest.spyOn(
        result.instance(),
        "_setTasksFetchingState"
    ),
    _fetchTasksAsyncSpy:       jest.spyOn(result.instance(), "_fetchTasksAsync"),
    _createTaskAsyncSpy:       jest.spyOn(result.instance(), "_createTaskAsync"),
    _updateTaskAsyncSpy:       jest.spyOn(result.instance(), "_updateTaskAsync"),
    _removeTaskAsyncSpy:       jest.spyOn(result.instance(), "_removeTaskAsync"),
    _completeAllTasksAsyncSpy: jest.spyOn(
        result.instance(),
        "_completeAllTasksAsync"
    ),
    componentDidMount: jest.spyOn(Scheduler.prototype, "componentDidMount"),
};

export { testMessage1, testMessage2, mocks, initialState, spies, result };
