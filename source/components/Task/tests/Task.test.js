// Test Utilities
import {
    testMessage1,
    testMessage2,
    mocks,
    baseTaskModel,
    updatedTaskModel,
    props,
    initialState,
    result,
    spies
} from "./setup";

afterEach(() => {
    result.setState(initialState);
    jest.clearAllMocks();
});

describe("Компонент Task:", () => {
    describe("должен иметь базовую разметку JSX:", () => {
        describe("должен соответствовать снимку разметки", () => {
            expect(result).toMatchSnapshot();
        });

        describe("должен иметь свойство класса со ссылкой (ref) на элемент <input />:", () => {
            test("должно называться «taskInput»", () => {
                expect(result.instance().taskInput).toBeDefined();
            });

            test("ref должен быть создан с помощью метода React.createRef", () => {
                expect(result.instance().taskInput.current).toBeDefined();
            });

            test("должно содержать ссылку на элемент <input />", () => {
                expect(result.instance().taskInput.current).toBeInstanceOf(
                    HTMLInputElement
                );
            });
        });
    });

    describe("должен иметь базовые пропсы, полученные от родительского компонента Scheduler:", () => {
        describe("id — идентификатор задачи", () => {
            test("должен существовать", () => {
                expect(result.prop("id")).toBeDefined();
            });
            test("должно иметь строковый тип", () => {
                expect(typeof result.prop("id")).toBe("string");
            });
        });

        describe("completed — описывает состояние выполнения задачи", () => {
            test("должен существовать", () => {
                expect(result.prop("completed")).toBeDefined();
            });
            test("должен иметь булевый тип", () => {
                expect(typeof result.prop("completed")).toBe("boolean");
            });
        });

        describe("favorite — описывает приоритетность задачи", () => {
            test("должен существовать", () => {
                expect(result.prop("favorite")).toBeDefined();
            });
            test("должен иметь булевый тип", () => {
                expect(typeof result.prop("favorite")).toBe("boolean");
            });
        });

        describe("created — описывает время создания задачи", () => {
            test("должен существовать", () => {
                expect(result.prop("created")).toBeDefined();
            });
            test("должен иметь строковый тип", () => {
                expect(typeof result.prop("created")).toBe("string");
            });
        });

        describe("modified — описывает время изменения задачи", () => {
            test("должен существовать", () => {
                expect(result.prop("modified")).toBeDefined();
            });
            test("должен иметь строковый тип", () => {
                expect(typeof result.prop("modified")).toBe("string");
            });
        });

        describe("message — описывает текстовый контент задачи", () => {
            test("должен существовать", () => {
                expect(result.prop("message")).toBeDefined();
            });
            test("должен иметь строковый тип", () => {
                expect(typeof result.prop("message")).toBe("string");
            });
        });

        describe("_removeTaskAsync — асинхронный метод компонента Scheduler, запускающий API-запрос по удалению задачи по ID", () => {
            test("должен существовать", () => {
                expect(result.prop("_removeTaskAsync")).toBeDefined();
            });
            test("должен быть функцией", () => {
                expect(typeof result.prop("_removeTaskAsync")).toBe("function");
            });
        });

        describe("_updateTaskAsync — асинхронный метод компонента Scheduler, запускающий API-запрос по обновлению задачи", () => {
            test("должен существовать", () => {
                expect(result.prop("_updateTaskAsync")).toBeDefined();
            });
            test("должен быть функцией", () => {
                expect(typeof result.prop("_updateTaskAsync")).toBe("function");
            });
        });
    });

    describe("должен иметь базовое изначальное состояние:", () => {
        describe("isTaskEditing — булевое свойство, описывающее состояние задачи — редактируемое или не редактируемое", () => {
            test("должно существовать", () => {
                expect(result.state("isTaskEditing")).toBeDefined();
            });
            test("должно иметь false в качестве изначального значения", () => {
                expect(result.state("isTaskEditing")).toBe(false);
            });
        });
        describe("newTaskMessage — строковое свойство, описывающее измененный новый текст для обновления задачи, последующей отправкой этой строки на сервер", () => {
            test("должно существовать", () => {
                expect(result.state("newMessage")).toBeDefined();
            });
            test("должно иметь значение из пропса message в качестве совего изначального значения", () => {
                expect(result.state("newMessage")).toBe(props.message);
            });
        });
    });

    describe("должен содержать базовые методы класса, реализованные через методы стрелки (свойства класса)", () => {
        describe("_getTaskShape", () => {
            test("должен существовать", () => {
                expect(typeof result.instance()._getTaskShape).toBe("function");
            });

            test(`должен принимать объект-модель задачи в качестве обязательного параметра, с не обязательными свойствами id, completed, favorite, message.`, () => {
                result.instance()._getTaskShape(updatedTaskModel);

                expect(spies._getTaskShapeSpy).toHaveBeenNthCalledWith(
                    1,
                    updatedTaskModel
                );
            });

            test("должен возвращать объект-модель задачи со свойствами id, completed, favorite, message", () => {
                result.instance()._getTaskShape(updatedTaskModel);

                expect(spies._getTaskShapeSpy).toHaveReturnedWith(
                    updatedTaskModel
                );
            });

            test("каждое свойство объекта-модели задачи в первом параметре должно иметь фолбек на соответствующее свойство из пропс компонента", () => {
                result.instance()._getTaskShape({});

                expect(spies._getTaskShapeSpy).toHaveReturnedWith(
                    baseTaskModel
                );
            });
        });

        describe("_setTaskEditingState", () => {
            test("должен существовать", () => {
                expect(typeof result.instance()._setTaskEditingState).toBe(
                    "function"
                );
            });

            test("должен менять свойство состояния компонента isTaskEditing в true, будучи вызванным с булевым аргументом true", () => {
                result.instance()._setTaskEditingState(true);
                expect(result.state("isTaskEditing")).toBe(true);
            });

            test("должен переводить фокус в элемент <input />, использовав ref-ссылку taskInput — только в случае перехода в режим редактирования задачи из обычного", () => {
                result.instance()._setTaskEditingState(true);

                expect(spies._taskInputFocusSpy).toHaveBeenCalledTimes(1);
            });

            test("не должен переводить фокус в элемент <input />, в случае перехода из режима редактирования задачи в обычный режим", () => {
                result.instance()._setTaskEditingState(false);

                expect(spies._taskInputFocusSpy).not.toHaveBeenCalled();
            });
        });

        describe("_updateNewTaskMessage", () => {
            test("должен существовать", () => {
                expect(typeof result.instance()._updateNewTaskMessage).toBe(
                    "function"
                );
            });

            test("должен обновлять свойство newMessage состояния, будучи вызванным в качестве обработчика события onChange", () => {
                result
                    .instance()
                    ._updateNewTaskMessage({ target: { value: testMessage2 }});

                expect(result.state("newMessage")).toBe(testMessage2);
            });
        });

        describe("_updateTask", () => {
            test("должен существовать", () => {
                expect(typeof result.instance()._updateTask).toBe("function");
            });

            test("должен вызывать асинхронный метод _updateTaskAsync, полученный из пропс", () => {
                result.setState({
                    newMessage: testMessage2,
                });

                result.instance()._updateTask();

                expect(mocks._updateTaskAsyncMock).toHaveBeenCalledTimes(1);
            });

            test("должен вызывать метод _setTaskEditingState с аргументом false", () => {
                result.setState({
                    newMessage: testMessage2,
                });

                result.instance()._updateTask();

                expect(spies._setTaskEditingStateSpy).toHaveBeenNthCalledWith(
                    1,
                    false
                );
            });

            test(`должен вызывать метод _setTaskEditingState с аргументом false и возвращать null, если значение state.newMessage равно значению props.message.
                при этом _updateTaskAsync не должен быть вызван`, () => {
                result.instance()._updateTask();

                expect(mocks._updateTaskAsyncMock).not.toHaveBeenCalled();
                expect(spies._setTaskEditingStateSpy).toHaveBeenNthCalledWith(
                    1,
                    false
                );
                expect(spies._updateTaskSpy).toHaveReturnedWith(null);
            });
        });

        describe("_updateTaskMessageOnClick", () => {
            test("должен существовать", () => {
                expect(typeof result.instance()._updateTaskMessageOnClick).toBe(
                    "function"
                );
            });

            test("должен вызывать метод класса _updateTask и возвращать null в режиме редактирования", () => {
                result.setState({
                    isTaskEditing: true,
                });

                result.instance()._updateTaskMessageOnClick();

                expect(spies._updateTaskSpy).toHaveBeenCalledTimes(1);
                expect(spies._updateTaskMessageOnClickSpy).toHaveReturnedWith(
                    null
                );
                expect(spies._setTaskEditingStateSpy).toHaveBeenCalledTimes(1);
            });

            test("должен вызвать метод класса _setTaskEditingState и не вызывать метод класса _updateTask в обычном режиме", () => {
                result.instance()._updateTaskMessageOnClick();

                expect(spies._setTaskEditingStateSpy).toHaveBeenCalledTimes(1);
                expect(spies._updateTaskSpy).toHaveBeenCalledTimes(0);
            });
        });

        describe("_cancelUpdatingTaskMessage", () => {
            test("должен существовать", () => {
                expect(
                    typeof result.instance()._cancelUpdatingTaskMessage
                ).toBe("function");
            });

            test("должен выключать режим редактирования", () => {
                result.instance()._cancelUpdatingTaskMessage();

                expect(result.state("isTaskEditing")).toBe(false);
            });

            test("должен менять значение свойства state.newMessage на значение свойства props.message", () => {
                result.instance()._cancelUpdatingTaskMessage();

                expect(result.state("newMessage")).toBe(testMessage1);
            });
        });

        describe("_updateTaskMessageOnKeyDown", () => {
            test("должен существовать", () => {
                expect(
                    typeof result.instance()._updateTaskMessageOnKeyDown
                ).toBe("function");
            });

            test("должен вызывать метод класса _updateTask, будучи вызванным в качестве обработчика события keyPres, после нажатия на клавишу Enter,", () => {
                result.instance()._updateTaskMessageOnKeyDown({
                    key: "Enter",
                });

                expect(spies._updateTaskSpy).toHaveBeenCalledTimes(1);
                expect(
                    spies._cancelUpdatingTaskMessageSpy
                ).toHaveBeenCalledTimes(0);
            });

            test("должен вызывать метод класса _cancelUpdatingTaskMessage, будучи вызванным в качестве ответа на нажатие на клавишу Escape (используется объект SyntheticEvent)", () => {
                result.instance()._updateTaskMessageOnKeyDown({
                    key: "Escape",
                });

                expect(spies._updateTaskSpy).toHaveBeenCalledTimes(0);
                expect(
                    spies._cancelUpdatingTaskMessageSpy
                ).toHaveBeenCalledTimes(1);
            });

            test("не должен совершать никаких операций и возвращать null, если свойство состояние newMessage — пустая строка", () => {
                result.setState({
                    newMessage: "",
                });

                result.instance()._updateTaskMessageOnKeyDown({
                    key: "Enter",
                });

                expect(spies._updateTaskSpy).toHaveBeenCalledTimes(0);
                expect(
                    spies._cancelUpdatingTaskMessageSpy
                ).toHaveBeenCalledTimes(0);
                expect(spies._updateTaskMessageOnKeyDownSpy).toHaveReturnedWith(
                    null
                );
            });
        });

        describe("_toggleTaskCompletedState", () => {
            test("должен существовать", () => {
                expect(typeof result.instance()._toggleTaskCompletedState).toBe(
                    "function"
                );
            });

            test("должен вызывать метод props._updateTaskAsync", () => {
                result.instance()._toggleTaskCompletedState();

                expect(mocks._updateTaskAsyncMock).toHaveBeenCalledTimes(1);
            });

            test("в качестве аргумента _updateTaskAsync должен получить модель задачи для обновления c противоположным значением props.completed", () => {
                result.instance()._toggleTaskCompletedState();

                expect(mocks._updateTaskAsyncMock).toHaveBeenNthCalledWith(1, {
                    ...baseTaskModel,
                    completed: !baseTaskModel.completed,
                });
            });

            test("модель задачи для обновления, нужно получить с помощью метода _getTaskShape", () => {
                result.instance()._toggleTaskCompletedState();

                expect(spies._getTaskShapeSpy).toHaveBeenNthCalledWith(1, {
                    completed: !baseTaskModel.completed,
                });
            });
        });

        describe("_toggleTaskFavoriteState", () => {
            test("должен существовать", () => {
                expect(typeof result.instance()._toggleTaskFavoriteState).toBe(
                    "function"
                );
            });

            test("должен вызывать метод пропсов _updateTaskAsync", () => {
                result.instance()._toggleTaskFavoriteState();

                expect(mocks._updateTaskAsyncMock).toHaveBeenCalledTimes(1);
            });

            test("в качестве аргумента _updateTaskAsync должен получить модель задачи для обновления, противоположным значением props.favorite", () => {
                result.instance()._toggleTaskFavoriteState();

                expect(mocks._updateTaskAsyncMock).toHaveBeenNthCalledWith(1, {
                    ...baseTaskModel,
                    favorite: !baseTaskModel.favorite,
                });
            });

            test("модель задачи для обновления, нужно получить с помощью метода _getTaskShape", () => {
                result.instance()._toggleTaskFavoriteState();

                expect(spies._getTaskShapeSpy).toHaveBeenNthCalledWith(1, {
                    favorite: !baseTaskModel.favorite,
                });
            });
        });

        describe("_removeTask", () => {
            test("должен существовать", () => {
                expect(typeof result.instance()._removeTask).toBe("function");
            });

            test("должен вызывать метод props._removeTaskAsync", () => {
                result.instance()._removeTask();

                expect(mocks._removeTaskAsyncMock).toHaveBeenCalledTimes(1);
            });

            test("в качестве аргумента метод props._removeTaskAsync должен получить идентификатор задачи из props.id", () => {
                result.instance()._removeTask();

                expect(mocks._removeTaskAsyncMock).toHaveBeenCalledWith(
                    props.id
                );
            });
        });
    });

    describe("должен имплементировать бизнес-логику", () => {
        describe("изменение задачи как «выполненной» или «не выполненной»:", () => {
            test("при нажатии на «чекбокс» (<Checkbox className = { Styles.toggleTaskCompletedState } />) — должен вызваться метод this._toggleTaskCompletedState", () => {
                result.instance().forceUpdate();
                result.find("div.toggleTaskCompletedState").simulate("click");

                expect(
                    spies._toggleTaskCompletedStateSpy
                ).toHaveBeenCalledTimes(1);
            });

            test("внутри _toggleTaskCompletedState должен быть вызван метод props._updateTaskAsync объектов обновленной задачи в качестве аргумента", () => {
                result.find("div.toggleTaskCompletedState").simulate("click");

                expect(mocks._updateTaskAsyncMock).toHaveBeenNthCalledWith(1, {
                    ...baseTaskModel,
                    completed: !baseTaskModel.completed,
                });
            });

            test("модель новой задачи для передачи аргументом методу _updateTaskAsync нужно получить с помощью _getTaskShape", () => {
                result.find("div.toggleTaskCompletedState").simulate("click");

                expect(spies._getTaskShapeSpy).toHaveBeenNthCalledWith(1, {
                    completed: !baseTaskModel.completed,
                });
            });
        });

        describe("редактирование задачи:", () => {
            test("при нажатии на «карандашик» (<Edit className = { Styles.updateTaskMessageOnClick } />) — должен вызваться метод this._updateTaskMessageOnClick", () => {
                result.find("div.updateTaskMessageOnClick").simulate("click");

                expect(
                    spies._updateTaskMessageOnClickSpy
                ).toHaveBeenCalledTimes(1);
            });

            test("компонент должен войти в режим редактирования, если при нажатии на «карандашик» находился в обычном режиме", () => {
                result.find("div.updateTaskMessageOnClick").simulate("click");

                expect(spies._setTaskEditingStateSpy).toHaveBeenNthCalledWith(
                    1,
                    true
                );
            });

            test("компонент должен вызвать метод this._updateTask и вернуть null, если при нажатии на «карандашик» находился в режиме редактирования", () => {
                result.setState({
                    isTaskEditing: true,
                });

                result.find("div.updateTaskMessageOnClick").simulate("click");

                expect(spies._updateTaskSpy).toHaveBeenCalledTimes(1);
                expect(spies._updateTaskMessageOnClickSpy).toHaveReturnedWith(
                    null
                );
            });

            test("компонент должен вызвать метод this._updateTaskMessageOnKeyDown при нажатии на клавиши Enter или Escape в режиме редактирования", () => {
                result.find("input").simulate("keyDown");

                expect(
                    spies._updateTaskMessageOnKeyDownSpy
                ).toHaveBeenCalledTimes(1);
            });
        });

        describe("изменение задачи как «приоритетной» или «не приоритетной»:", () => {
            test("при нажатии на «звездочку» (<Star className = { Styles.toggleTaskFavoriteState } />) — должен вызваться метод this._toggleTaskFavoriteState", () => {
                result.find("div.toggleTaskFavoriteState").simulate("click");

                expect(spies._toggleTaskFavoriteStateSpy).toHaveBeenCalledTimes(
                    1
                );
            });

            test("внутри _toggleTaskFavoriteState должен быть вызван метод props._updateTaskAsync объектов обновленной задачи в качестве аргумента", () => {
                result.find("div.toggleTaskFavoriteState").simulate("click");

                expect(mocks._updateTaskAsyncMock).toHaveBeenNthCalledWith(1, {
                    ...baseTaskModel,
                    favorite: !baseTaskModel.favorite,
                });
            });

            test("модель новой задачи для передачи аргументом методу _updateTaskAsync нужно получить с помощью _getTaskShape", () => {
                result.find("div.toggleTaskFavoriteState").simulate("click");

                expect(spies._getTaskShapeSpy).toHaveBeenNthCalledWith(1, {
                    favorite: !baseTaskModel.favorite,
                });
            });
        });

        describe("удаления задачи:", () => {
            test("при нажатии на «крестик» (<Remove className = { Styles.removeTask } />) — должен вызваться метод this._removeTask", () => {
                result.find("div.removeTask").simulate("click");

                expect(spies._removeTaskSpy).toHaveBeenCalledTimes(1);
            });

            test("внутри _removeTask должен быть вызван метод props._removeTaskAsync с аргументом props.id", () => {
                result.find("div.removeTask").simulate("click");

                expect(mocks._removeTaskAsyncMock).toHaveBeenNthCalledWith(
                    1,
                    props.id
                );
            });
        });
    });
});
