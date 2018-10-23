// Core
import React, { Component } from 'react';

// Components
import Spinner from '../../components/Spinner';
import Task from '../Task';

// Instruments
import Styles from './styles.m.css';
import { api } from '../../REST'; // ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')
import Checkbox from '../../theme/assets/Checkbox';

export default class Scheduler extends Component {
    state = {
        message: '',
        tasks: [],
        isSpinning: false,
        allCompleted: false,
        isSearchApplied: false,
    };

    componentDidMount () {
        this._fetchTasksAsync();
    };

    _updateMessage = (event) => {
        const { value: message } = event.target;

        this.setState({ message });
    }

    _fetchTasksAsync = async () => {
        try {
            this.setState({
                isSpinning: true,
            });

            const tasks = await api.fetchTasks();

            this.setState({
                tasks,
                isSpinning: false,
            });
            this._setAllCompletedState();
        } catch (error) {
            console.log(error.message);
            this.setState({
                isSpinning: false,
            });
        }
    };

    _setAllCompletedState = () => {
        const tasks = this.state.tasks;
        const allCompleted = tasks.every((task) => {
            return task.completed;
        });

        this.setState({
            allCompleted,
        });
    };

    _handleFormSubmit = (event) => {
        event.preventDefault();
        this._submitTask();
    };

    _submitTask = () => {
        const { message } = this.state;

        if (!message) {
            return null;
        }

        this._addTaskAsync(message) ;
        this.setState({ message: '' });
    };

    _addTaskAsync = async (message) => {
        try {
            this.setState({
                isSpinning: true,
            });

            const task = await api.createTask(message);

            this.setState(({ tasks }) => ({
                tasks: [task, ...tasks],
                isSpinning: false,
            }));
        } catch (error) {
            console.log(error.message);
            this.setState({
                isSpinning: false,
            });
        }
    };

    _updateTaskAsync = async (task) => {
        try {
            this.setState({
                isSpinning: true,
            });

            const updatedTask = await api.updateTask(task);

            this.setState(({ tasks }) => ({
                tasks: tasks.map((task) => task.id === updatedTask.id ? updatedTask : task),
                isSpinning: false,
            }));
            this._setAllCompletedState();
        } catch (error) {
            console.log(error.message);
            this.setState({
                isSpinning: false,
            });
        }
    };

    _removeTaskAsync = async (taskId) => {
        try {
            this.setState({
                isSpinning: true,
            });

            await api.removeTask(taskId);

            this.setState(({ tasks }) => ({
                tasks: tasks.filter(({ id }) => id !== taskId),
                isSpinning: false,
            }));
        } catch (error) {
            console.log(error.message);
            this.setState({
                isSpinning: false,
            });
        }
    };

    _completeAllTasksAsync = async () => {
        if (this.state.allCompleted) return;

        try {
            this.setState({
                isSpinning: true,
            });

            const tasks = this.state.tasks.map((task) => {
                task.completed = true;
                return task;
            });

            await api.completeAllTasks(tasks);

            this.setState(() => ({
                tasks: tasks,
                isSpinning: false,
                allCompleted: true,
            }));
        } catch (error) {
            console.log(error.message);
            this.setState({
                isSpinning: false,
            });
        }
    };

    _searchTasks = (event) => {
        const value = event.target.value.toLowerCase();

        if (value === '') {
            this.setState({
                isSearchApplied: false,
            });

            return;
        }

        this.setState(({ tasks }) => ({
            isSearchApplied: true,
            tasks: tasks.map((task) => {
                task.toShow = task.message.toLowerCase().includes(value);
                return task;
            }),
        }));
    };

    render () {
        const { message, tasks, isSpinning, isSearchApplied } = this.state;
        let filteredTasks = tasks;

        // Apply search result
        if (isSearchApplied) {
            filteredTasks = tasks.filter((task) => task.toShow);
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
        const tasksJSX = filteredTasks.map((task, i) => (
            <Task 
                { ...task }
                updateTask = { this._updateTaskAsync }
                removeTask = { this._removeTaskAsync }
                key = { task.id }
            />
        ));

        return (
            <section className = { Styles.scheduler }>
                <Spinner isSpinning = { isSpinning } />
                <main>
                    <header>
                        <h1>Scheduler</h1>
                        <input 
                            type = "search" 
                            placeholder = "Search"
                            onChange = {this._searchTasks}
                        />
                    </header>
                    <section>
                        <form
                            onSubmit = { this._handleFormSubmit }
                        >
                            <input 
                                type="text" 
                                placeholder="New task's description"
                                value = { message }
                                maxLength="50"
                                onChange = { this._updateMessage }
                            />
                            <button>Add task</button>
                        </form>
                        <ul>
                            { tasksJSX }
                        </ul>
                    </section>
                    <footer>
                        <Checkbox 
                            color1 = {'#363636'} 
                            color2 = {'#fff'} 
                            onClick = { this._completeAllTasksAsync }
                            checked = { this.state.allCompleted }
                        />
                        <span className = { Styles.completeAllTasks }>Complete all tasks</span>
                    </footer>
                </main>
            </section>
        );
    };
};
