// Core
import React, { Component } from 'react';
import FlipMove from 'react-flip-move';

// Components
import Spinner from '../../components/Spinner';
import Task from '../Task';

// Instruments
import Styles from './styles.m.css';
import { api } from '../../REST'; // ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')
import Checkbox from '../../theme/assets/Checkbox';

export default class Scheduler extends Component {
    state = {
        newTaskMessage: '',
        tasksFilter: '',
        tasks: [],
        isTasksFetching: false,
    };

    componentDidMount () {
        this._fetchTasksAsync();
    };

    _setTasksFetchingState = (state) => {
        this.setState({ isTasksFetching: state });
    };

    _updateNewTaskMessage = (event) => {
        const { value: newTaskMessage } = event.target;

        this.setState({ newTaskMessage });
    }

    _fetchTasksAsync = async () => {
        try {
            this._setTasksFetchingState(true);

            const tasks = await api.fetchTasks();

            this.setState({
                tasks,
            });
            this._setTasksFetchingState(false);
        } catch (error) {
            console.log(error.message);
            this._setTasksFetchingState(false);
        }
    };

    _createTaskAsync = async (event) => {
        event.preventDefault();

        const { newTaskMessage } = this.state;

        if (newTaskMessage === '') return null;

        try {
            this._setTasksFetchingState(true);

            const task = await api.createTask(newTaskMessage);

            this.setState(({ tasks }) => ({
                tasks: [task, ...tasks],
                newTaskMessage: '',
            }));

            this._setTasksFetchingState(false);
        } catch (error) {
            console.log(error.message);
            this.setState({
                isTasksFetching: false,
            });
        }
    };

    _updateTaskAsync = async (task) => {
        try {
            this._setTasksFetchingState(true);

            const updatedTask = await api.updateTask(task);

            this.setState(({ tasks }) => ({
                tasks: tasks.map((task) => task.id === updatedTask.id ? updatedTask : task),
            }));

            this._setTasksFetchingState(false);
        } catch (error) {
            console.log(error.message);
            this.setState({
                isTasksFetching: false,
            });
        }
    };

    _removeTaskAsync = async (taskId) => {
        try {
            this._setTasksFetchingState(true);

            await api.removeTask(taskId);

            this.setState(({ tasks }) => ({
                tasks: tasks.filter(({ id }) => id !== taskId),
            }));

            this._setTasksFetchingState(false);
        } catch (error) {
            console.log(error.message);
            this.setState({
                isTasksFetching: false,
            });
        }
    };

    _getAllCompleted = () => {
        const isAllCompleted = this.state.tasks.every(
            (task) => task.completed
        );

        return isAllCompleted;
    };

    _completeAllTasksAsync = async () => {
        if (this._getAllCompleted()) return null;
        
        try {
            this._setTasksFetchingState(true);

            const uncompletedTasks = this.state.tasks.filter((task) => task.completed === false);

            await api.completeAllTasks(uncompletedTasks);

            this.setState(({tasks}) => ({
                tasks: tasks.map((task) => {
                    task.completed = true;
                    return task;
                }),
            }));

            this._setTasksFetchingState(false);
        } catch (error) {
            console.log(error.message);
            this._setTasksFetchingState(false);
        }
    };

    _updateTasksFilter = (event) => {
        const tasksFilter = event.target.value.toLowerCase();

        this.setState({ tasksFilter });
    };

    render () {
        const { newTaskMessage, tasks, isTasksFetching, tasksFilter } = this.state;
        let filteredTasks = tasks;

        // Apply search result
        if (tasksFilter !== '') {
            filteredTasks = tasks.filter((task) => task.message.toLowerCase().includes(tasksFilter));
        }
        // Sort starred
        filteredTasks.sort((a, b) => {
            if (!a.favorite && b.favorite) return 1;
            if (a.favorite && !b.favorite) return -1;
        });
        // Sort completed
        filteredTasks.sort((a, b) => {
            if (a.completed && !b.completed) return 1;
            if (!a.completed && b.completed) return -1;
        });
        const tasksJSX = filteredTasks.map((task) => (
            <Task 
                { ...task }
                _updateTaskAsync = { this._updateTaskAsync }
                _removeTaskAsync = { this._removeTaskAsync }
                key = { task.id }
            />
        ));

        return (
            <section className = { Styles.scheduler }>
                <Spinner isSpinning = { isTasksFetching } />
                <main>
                    <header>
                        <h1>Планировщик задач</h1>
                        <input 
                            type = "search" 
                            placeholder = "Поиск"
                            onChange = {this._updateTasksFilter}
                            value = {this.state.tasksFilter}
                        />
                    </header>
                    <section>
                        <form
                            onSubmit = { this._createTaskAsync }
                        >
                            <input 
                                className = {Styles.createTask}
                                type="text" 
                                placeholder="Описaние моей новой задачи"
                                value = { newTaskMessage }
                                maxLength={50}
                                onChange = { this._updateNewTaskMessage }
                            />
                            <button>Добавить задачу</button>
                        </form>
                        <div className="overlay">
                            <ul>
                                <FlipMove
                                    duration = {400}
                                >
                                    { tasksJSX }
                                </FlipMove>
                            </ul>
                        </div>
                    </section>
                    <footer>
                        <Checkbox 
                            color1 = {'#363636'} 
                            color2 = {'#fff'} 
                            onClick = { this._completeAllTasksAsync }
                            checked = { this._getAllCompleted() }
                        />
                        <span className = { Styles.completeAllTasks }>Все задачи выполнены</span>
                    </footer>
                </main>
            </section>
        );
    };
};
