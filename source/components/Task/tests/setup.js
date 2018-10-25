// Core
import React from "react";
import { mount } from "enzyme";

// Test component
import Task from "../";

const testMessage1 = "Выполнить важную задачу.";
const testMessage2 = "Выполнить важную задачу срочно!";

// Mocks
const mocks = {
    _removeTaskAsyncMock: jest.fn(),
    _updateTaskAsyncMock: jest.fn(),
};

const baseTaskModel = {
    id:        "123",
    completed: false,
    favorite:  false,
    message:   testMessage1,
};

const updatedTaskModel = {
    id:        "321",
    completed: true,
    favorite:  true,
    message:   testMessage2,
};

const props = {
    ...baseTaskModel,
    created:          "2018-06-13T19:23:33.028Z",
    modified:         "2018-06-21T18:43:41.752Z",
    _removeTaskAsync: mocks._removeTaskAsyncMock,
    _updateTaskAsync: mocks._updateTaskAsyncMock,
};

const initialState = {
    isTaskEditing: false,
    newMessage:    props.message,
};

const result = mount(<Task { ...props } />);

// Spies
const spies = {
    _setTaskEditingStateSpy: jest.spyOn(
        result.instance(),
        "_setTaskEditingState"
    ),
    _updateTaskSpy:           jest.spyOn(result.instance(), "_updateTask"),
    _getTaskShapeSpy:         jest.spyOn(result.instance(), "_getTaskShape"),
    _updateNewTaskMessageSpy: jest.spyOn(
        result.instance(),
        "_updateNewTaskMessage"
    ),
    _updateTaskMessageOnClickSpy: jest.spyOn(
        result.instance(),
        "_updateTaskMessageOnClick"
    ),
    _cancelUpdatingTaskMessageSpy: jest.spyOn(
        result.instance(),
        "_cancelUpdatingTaskMessage"
    ),
    _updateTaskMessageOnKeyDownSpy: jest.spyOn(
        result.instance(),
        "_updateTaskMessageOnKeyDown"
    ),
    _toggleTaskCompletedStateSpy: jest.spyOn(
        result.instance(),
        "_toggleTaskCompletedState"
    ),
    _toggleTaskFavoriteStateSpy: jest.spyOn(
        result.instance(),
        "_toggleTaskFavoriteState"
    ),
    _removeTaskSpy:     jest.spyOn(result.instance(), "_removeTask"),
    _taskInputFocusSpy: jest.spyOn(
        result.instance().taskInput.current,
        "focus"
    ),
};

export {
    testMessage1,
    testMessage2,
    mocks,
    baseTaskModel,
    updatedTaskModel,
    props,
    initialState,
    result,
    spies
};
