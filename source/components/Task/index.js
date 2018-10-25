// Core
import React, { PureComponent } from "react";
import cx from "classnames";

// Instruments
import Styles from "./styles.m.css";
import Checkbox from "../../theme/assets/Checkbox";
import Star from "../../theme/assets/Star";
import Edit from "../../theme/assets/Edit";
import Remove from "../../theme/assets/Remove";

export default class Task extends PureComponent {
    state = {
        isTaskEditing: false,
        message:       this.props.message,
        newMessage:    this.props.message,
    };

    taskInput = React.createRef();

    _getTaskShape = ({
        id = this.props.id,
        completed = this.props.completed,
        favorite = this.props.favorite,
        message = this.props.message,
    }) => ({
        id,
        completed,
        favorite,
        message,
    });

    _removeTask = () => {
        const { id, _removeTaskAsync } = this.props;

        _removeTaskAsync(id);
    };

    _updateTask = (task) => {
        const { _updateTaskAsync } = this.props;

        this._setTaskEditingState(false);

        if (this.state.newMessage === this.props.message) {
            return null;
        }

        _updateTaskAsync(task);
    };

    _toggleTaskCompletedState = () => {
        const { completed, _updateTaskAsync } = this.props;
        const task = this._getTaskShape({ completed: !completed });

        _updateTaskAsync(task);
    };

    _toggleTaskFavoriteState = () => {
        const { favorite, _updateTaskAsync } = this.props;
        const task = this._getTaskShape({ favorite: !favorite });

        _updateTaskAsync(task);
    };

    _cancelUpdatingTaskMessage = () => {
        this.setState({ newMessage: this.props.message });
        this._setTaskEditingState(false);
    };

    _setTaskEditingState = (state) => {
        if (state === true) {
            this.setState({ isTaskEditing: state }, () =>
                this.taskInput.current.focus()
            );
        } else {
            this.setState({ isTaskEditing: state });
        }
    };

    _updateTaskMessageOnClick = () => {
        const { isTaskEditing, newMessage } = this.state;
        const task = this._getTaskShape({ message: newMessage });

        if (isTaskEditing) {
            this._updateTask(task);

            return null;
        }
        this._setTaskEditingState(true);

    };

    _updateNewTaskMessage = (event) => {
        this.setState({
            newMessage: event.target.value,
        });
    };

    _updateTaskMessageOnKeyDown = (event) => {
        if (event.key === "Enter") {
            if (this.state.newMessage === "") {
                return null;
            }

            const task = this._getTaskShape({ message: this.state.newMessage });

            this._updateTask(task);

            this.setState({
                isTaskEditing: false,
            });
        } else if (event.key === "Escape") {
            this._cancelUpdatingTaskMessage();
        }
    };

    _getTaskStyles = () => {
        const { completed } = this.props;

        return cx(Styles.task, {
            [Styles.completed]: completed,
        });
    };

    render () {
        const { completed, favorite } = this.props;
        const iconsColor = "#3B8EF3";
        const iconsFillColor = "#FFF";
        const taskStyles = this._getTaskStyles();

        return (
            <li className = { taskStyles }>
                <div className = { Styles.content }>
                    <Checkbox
                        inlineBlock
                        checked = { completed }
                        className = { Styles.toggleTaskCompletedState }
                        color1 = { iconsColor }
                        color2 = { iconsFillColor }
                        onClick = { this._toggleTaskCompletedState }
                    />
                    <input
                        disabled = { !this.state.isTaskEditing }
                        maxLength = { 50 }
                        onChange = { this._updateNewTaskMessage }
                        onKeyDown = { this._updateTaskMessageOnKeyDown }
                        ref = { this.taskInput }
                        type = 'text'
                        value = { this.state.newMessage }
                    />
                </div>
                <div className = { Styles.actions }>
                    <Star
                        checked = { favorite }
                        className = { Styles.toggleTaskFavoriteState }
                        inlineBlock
                        color1 = { iconsColor }
                        color2 = { "#000" }
                        onClick = { this._toggleTaskFavoriteState }
                    />
                    <Edit
                        checked = { this.state.isTaskEditing }
                        className = { Styles.updateTaskMessageOnClick }
                        inlineBlock
                        color1 = { iconsColor }
                        color2 = { "#000" }
                        onClick = { this._updateTaskMessageOnClick }
                    />
                    <Remove
                        className = { Styles.removeTask }
                        inlineBlock
                        color1 = { iconsColor }
                        color2 = { "#000" }
                        onClick = { this._removeTask }
                    />
                </div>
            </li>
        );
    }
}
