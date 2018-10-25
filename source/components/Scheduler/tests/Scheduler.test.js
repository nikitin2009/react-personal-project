// Test utilities
import {
    testMessage1,
    testMessage2,
    mocks,
    initialState,
    spies,
    result
} from "./setup";
import { BaseTaskModel } from "../../../instruments";
import { api } from "../../../REST";

jest.mock("../../../REST");

describe("Компонент Scheduler:", () => {
    describe("должен иметь базовую разметку JSX:", () => {
        test("должен соответствовать снимку разметки", () => {
            expect(result).toMatchSnapshot();
        });
    });

    describe("должен иметь базовое изначальное состояние:", () => {
        describe("newTaskMessage — строковое свойство, описывающее текст новой задачи задачи", () => {
            test("должно существовать", () => {
                expect(result.state("newTaskMessage")).toBeDefined();
            });

            test("должно иметь пустую строку в качестве изначального значения", () => {
                expect(result.state("newTaskMessage")).toBe("");
            });
        });

        describe("tasksFilter — строковое свойство, описывающее текстовое значение фильтра задач", () => {
            test("должно существовать", () => {
                expect(result.state("tasksFilter")).toBeDefined();
            });

            test("должно иметь пустую строку в качестве изначального значения", () => {
                expect(result.state("tasksFilter")).toBe("");
            });
        });

        describe("isTasksFetching — булевое свойство, описывающее состояние спиннера", () => {
            test("должно существовать", () => {
                expect(result.state("isTasksFetching")).toBeDefined();
            });

            test("должно иметь false в качестве изначального значения", () => {
                expect(result.state("isTasksFetching")).toBe(false);
            });
        });

        describe("tasks — массив, содержащий объекты с задачами", () => {
            test("должно существовать", () => {
                expect(result.state("tasks")).toBeDefined();
            });

            test("должно иметь пустой массив в качестве изначального значения", () => {
                result.setState(initialState);
                expect(result.state("tasks")).toBeInstanceOf(Array);
                expect(result.state("tasks")).toHaveLength(0);
            });
        });
    });

    describe("должен содержать базовые методы класса, реализированные через методы стрелки (свойства класса)", () => {
        describe("_updateTasksFilter", () => {
            afterEach(() => {
                result.setState(initialState);
                jest.clearAllMocks();
            });

            test("должен менять свойство состояния state.tasksFilter текстовым контентом, будучи вызванным в качестве обработчика события onChange", () => {
                result.instance()._updateTasksFilter({
                    target: {
                        value: "123",
                    },
                });
                expect(result.state("tasksFilter")).toBe("123");
            });

            test("должен работать в case-insensitive режиме", () => {
                result.instance()._updateTasksFilter({
                    target: {
                        value: testMessage1,
                    },
                });

                expect(result.state("tasksFilter")).toBe(
                    testMessage1.toLocaleLowerCase()
                );
            });
        });

        describe("_updateNewTaskMessage", () => {
            afterAll(() => {
                result.setState(initialState);
                jest.clearAllMocks();
            });

            test("должен менять свойство state.newTaskMessage текстовым контентом, будучи вызванным в качестве обработчика события onChange", () => {
                result.instance()._updateNewTaskMessage({
                    target: {
                        value: testMessage1,
                    },
                });

                expect(result.state("newTaskMessage")).toBe(testMessage1);
            });
        });

        describe("_getAllCompleted", () => {
            afterEach(() => {
                result.setState(initialState);
                jest.clearAllMocks();
            });

            test("должен вернуть true, если все задачи в свойстве state.tasks — выполнены (completed)", () => {
                const completedTasksArray = [...Array(5).keys()].map(
                    () => new BaseTaskModel(void 0, true)
                );

                result.setState({
                    tasks: completedTasksArray,
                });

                expect(result.instance()._getAllCompleted()).toBe(true);
            });

            test("должен вернуть false, если хотя-бы одна задача в свойстве state.tasks — не выполнена (!completed)", () => {
                const completedTasksArray = [...Array(5).keys()].map(
                    () => new BaseTaskModel(void 0, true)
                );

                completedTasksArray.push(new BaseTaskModel());

                result.setState({
                    tasks: completedTasksArray,
                });

                expect(result.instance()._getAllCompleted()).toBe(false);
            });
        });

        describe("_setTasksFetchingState", () => {
            afterAll(() => {
                result.setState(initialState);
                jest.clearAllMocks();
            });

            test("должен менять состояние свойства state.isTasksFetching в зависимости от переданного первого аргумента булевого типа", () => {
                result.instance()._setTasksFetchingState(true);
                expect(result.state("isTasksFetching")).toBe(true);
                result.instance()._setTasksFetchingState(false);
                expect(result.state("isTasksFetching")).toBe(false);
            });
        });

        describe("_fetchTasksAsync", () => {
            afterAll(() => {
                result.setState(initialState);
                jest.clearAllMocks();
            });

            test("должен быть асинхронным", async () => {
                await expect(
                    result.instance()._fetchTasksAsync()
                ).resolves.toBeUndefined();
            });

            test("должен вызывать метод this._setTasksFetchingState для включения спиннера", () => {
                expect(spies._setTasksFetchingStateSpy).toHaveBeenNthCalledWith(
                    1,
                    true
                );
            });

            test("должен выполнить обращение к методу api.fetchTasks из модуля REST", () => {
                expect(api.fetchTasks).toHaveBeenCalledTimes(1);
            });

            test("должен обновить состояние объектами задач, полученными с API", () => {
                expect(result.state("tasks")).toHaveLength(2);
            });

            test("в конце запроса должен вызывать метод this._setTasksFetchingState для выключения спиннера", () => {
                expect(spies._setTasksFetchingStateSpy).toHaveBeenNthCalledWith(
                    2,
                    false
                );
            });
        });

        describe("_createTaskAsync", () => {
            afterAll(() => {
                result.setState(initialState);
                jest.clearAllMocks();
            });

            test("должен быть асинхронным, и должен возвращать null, не обращаясь к api.createTask, будучи вызванным когда state.newTaskMessage — пустая строка", async () => {
                await expect(
                    result.instance()._createTaskAsync({
                        preventDefault: mocks.preventDefaultMock,
                    })
                ).resolves.toBeNull();

                expect(api.createTask).not.toHaveBeenCalled();

                jest.clearAllMocks();
            });

            test("должен вызывать метод preventDefault синтетического события будучи вызванным в качестве обработчика события onSubmit, когда state.newTaksMessage — не пустая строка", async () => {
                result.setState({
                    newTaskMessage: testMessage2,
                });

                await result.instance()._createTaskAsync({
                    preventDefault: mocks.preventDefaultMock,
                });

                expect(mocks.preventDefaultMock).toHaveBeenCalledTimes(1);
            });

            test("должен вызывать метод this._setTasksFetchingState для включения спиннера", () => {
                expect(spies._setTasksFetchingStateSpy).toHaveBeenNthCalledWith(
                    1,
                    true
                );
            });

            test("должен выполнить обращение к методу api.createTask из модуля REST, передав тому текст задачи из свойства state.newTaskMessage, для отправки на сервер", () => {
                expect(api.createTask).toHaveBeenCalledTimes(1);
                expect(api.createTask).toHaveBeenCalledWith(testMessage2);
            });

            test("должен обновить состояние объектом новосозданной задач, полученной с API, а значение свойства newTaskMessage должно стать пустой строкой", () => {
                expect(result.state("tasks")).toHaveLength(1);
                expect(result.state("newTaskMessage")).toBe("");
            });

            test("в конце запроса должен вызывать метод this._setTasksFetchingState для выключения спиннера", () => {
                expect(spies._setTasksFetchingStateSpy).toHaveBeenNthCalledWith(
                    2,
                    false
                );
            });
        });

        describe("_updateTaskAsync", () => {
            afterAll(() => {
                result.setState(initialState);
                jest.clearAllMocks();
            });

            const updatedTask = new BaseTaskModel(void 0, void 0, true);

            test("должен быть асинхронным", async () => {
                await expect(
                    result.instance()._updateTaskAsync(updatedTask)
                ).resolves.toBeUndefined();
            });

            test("должен вызывать метод this._setTasksFetchingState для включения спиннера", () => {
                expect(spies._setTasksFetchingStateSpy).toHaveBeenNthCalledWith(
                    1,
                    true
                );
            });

            test("должен обратится к методу api.updateTask из модуля REST, передав ему аргументом объект задачи, полученной из первого параметра самого _updateTaskAsync", () => {
                expect(api.updateTask).toHaveBeenCalledTimes(1);
                expect(api.updateTask).toHaveBeenCalledWith(updatedTask);
            });

            test("в конце запроса должен вызывать метод this._setTasksFetchingState для выключения спиннера", () => {
                expect(spies._setTasksFetchingStateSpy).toHaveBeenNthCalledWith(
                    2,
                    false
                );
            });
        });

        describe("_removeTaskAsync", () => {
            afterAll(() => {
                result.setState(initialState);
                jest.clearAllMocks();
            });

            const taskId = "123";

            result.setState({
                tasks: [new BaseTaskModel(taskId)],
            });

            test("должен быть асинхронным", async () => {
                await expect(
                    result.instance()._removeTaskAsync(taskId)
                ).resolves.toBeUndefined();
            });

            test("должен вызывать метод this._setTasksFetchingState для включения спиннера", () => {
                expect(spies._setTasksFetchingStateSpy).toHaveBeenNthCalledWith(
                    1,
                    true
                );
            });

            test("должен выполнить обращение к методу api.removeTask из модуля REST, передав ему аргументом при вызове идентификатор задачи для удаления", () => {
                expect(api.removeTask).toHaveBeenCalledTimes(1);
                expect(api.removeTask).toHaveBeenCalledWith(taskId);
            });

            test("должен удалить из локального состояния задачу, если задача успешно была удалена на сервере", () => {
                expect(result.state("tasks")).toHaveLength(0);
            });

            test("в конце запроса должен вызывать метод this._setTasksFetchingState для выключения спиннера", () => {
                expect(spies._setTasksFetchingStateSpy).toHaveBeenNthCalledWith(
                    2,
                    false
                );
            });
        });

        describe("_completeAllTasksAsync", () => {
            afterAll(() => {
                result.setState(initialState);
                jest.clearAllMocks();
            });

            const completedTasks = [...Array(5).keys()].map(() => {
                return new BaseTaskModel(void 0, true);
            });

            const notCompletedTasks = [...Array(5).keys()].map(() => {
                return new BaseTaskModel();
            });

            test("должен быть асинхронным", async () => {
                await expect(
                    result.instance()._completeAllTasksAsync()
                ).resolves.toBeNull();

                jest.clearAllMocks();
            });

            test("не должен выполнять обращение к api.completeAllTasks и должен вернуть null, если все задачи в state.tasks — выполнены", async () => {
                result.setState({
                    tasks: completedTasks,
                });

                await expect(
                    result.instance()._completeAllTasksAsync()
                ).resolves.toBeNull();

                expect(api.completeAllTasks).not.toHaveBeenCalled();

                jest.clearAllMocks();
            });

            test("должен вызвать this._setTasksFetchingState для включения спиннера, если в состоянии есть хотя-бы одна не выполненная задача", async () => {
                result.setState({
                    tasks: notCompletedTasks,
                });

                await expect(
                    result.instance()._completeAllTasksAsync()
                ).resolves.toBeUndefined();

                expect(spies._setTasksFetchingStateSpy).toHaveBeenNthCalledWith(
                    1,
                    true
                );
            });

            test("а также — должен обратится к api.completeAllTasks, передав в качестве аргумента массив с не выполненными задачи из состояния", () => {
                expect(api.completeAllTasks).toHaveBeenNthCalledWith(
                    1,
                    notCompletedTasks
                );
            });

            test("должен перевести все задачи в локальном состоянии компонента в выполненные", () => {
                expect(
                    result.state("tasks").every((task) => task.completed)
                ).toBe(true);
            });

            test("должен вызывать метод this._setTasksFetchingState для включения спиннера", () => {
                expect(spies._setTasksFetchingStateSpy).toHaveBeenNthCalledWith(
                    1,
                    true
                );
            });
        });
    });

    describe("должен имплементировать бизнес-логику", () => {
        describe("создания новой задачи:", () => {
            test("в качестве изначального состояния текст новой задачи должен быть пустой строкой", () => {
                expect(result.state("newTaskMessage")).toBe("");
            });

            test("в качестве изначального значения элемента <input /> внутри элемента <form /> должна быть пустая строка.", () => {
                expect(result.find("form > input").prop("value")).toBe("");
            });

            test("значение элемента <input /> внутри элемента form должно контролироваться свойством state.newTaskMessage", () => {
                result.setState({
                    newTaskMessage: testMessage2,
                });
                expect(result.find("form > input").prop("value")).toBe(
                    testMessage2
                );
                result.setState(initialState);
            });

            test("максимальная длина строки элемента <input /> не должна превышать 50 символов", () => {
                expect(result.find("form > input").prop("maxLength")).toBe(50);
            });

            test("при введение текста в элемент <input /> внутри <form /> должен сработать метод this._updateNewTaskMessage", () => {
                const syntheticEvent = {
                    target: {
                        value: testMessage2,
                    },
                };

                result.find("form > input").simulate("change", syntheticEvent);
                expect(spies._updateNewTaskMessageSpy).toHaveBeenCalledTimes(1);
            });

            test("при сабмите формы должен вызваться метод this._createTaskAsync", () => {
                const syntheticEvent = {
                    preventDefault: mocks.preventDefaultMock,
                };

                result.find("form").simulate("submit", syntheticEvent);
                expect(spies._createTaskAsyncSpy).toHaveBeenCalledTimes(1);
            });

            test("должен быть вызван метод syntheticEvent.preventDefault", () => {
                expect(mocks.preventDefaultMock).toHaveBeenCalledTimes(1);
            });

            test("если значение state.newTaskMessage — не пустая строка, то должен произойти вызов api.createTask из модуля REST с аргументом в виде state.newTaskMessage", () => {
                expect(api.createTask).toHaveBeenCalledTimes(1);
                expect(api.createTask).toHaveBeenCalledWith(testMessage2);
            });

            test("значение state.newTaskMessage должно стать пустой строкой", () => {
                expect(result.state("newTaskMessage")).toBe("");
            });
        });

        describe("фильтрации задачи:", () => {
            test("в качестве изначального состояния текст фильтрации задач должен быть пустой строкой", () => {
                expect(result.state("tasksFilter")).toBe("");
            });

            test('в качестве изначального значения элемента <input type="search" /> должна быть пустая строка', () => {
                expect(result.find('input[type="search"]').prop("value")).toBe(
                    ""
                );
            });

            test('значение элемента <input type="search" /> должно контролироваться свойством state.tasksFilter', () => {
                result.setState({
                    tasksFilter: testMessage2,
                });
                expect(result.find('input[type="search"]').prop("value")).toBe(
                    testMessage2
                );
                result.setState(initialState);
            });

            test('ввод текста в <input type="search" /> должен привести к вызову обработчика this._updateTasksFilter', () => {
                result.find('input[type="search"]').simulate("change", {
                    target: {
                        value: testMessage2,
                    },
                });

                expect(spies._updateTasksFilterSpy).toHaveBeenCalledTimes(1);
            });
        });

        describe("выполнения всех задачи одной кнопкой:", () => {
            test("при клике на <Checkbox /> с текстом «Все задачи выполнены» в <footer /> — должен быть вызван обработчик this._completeAllTasksAsync", () => {
                result.find("footer div").simulate("click");

                expect(spies._completeAllTasksAsyncSpy).toHaveBeenCalledTimes(
                    1
                );
            });
        });
    });
});
