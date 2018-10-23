// Core
import React, { PureComponent } from 'react';
import cx from 'classnames';

// Instruments
import Styles from './styles.m.css';
import Checkbox from '../../theme/assets/Checkbox';
import Star from '../../theme/assets/Star';
import Edit from '../../theme/assets/Edit';
import Remove from '../../theme/assets/Remove';

export default class Task extends PureComponent {
    state = {
        isEditing: false,
        message: this.props.message,
    };

    messageElement = React.createRef();

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

    _setTaskEditingState = (state) => {
        this.setState(
            { isEditing: state }
        );
    };

    _removeTask = () => {
        const { id, removeTask } = this.props;

        removeTask(id);
    };

    _updateTask = this.props.updateTask;

    _completeTask = () => {
        const { completed } = this.props;
        const task = this._getTaskShape({ completed: !completed });

        this._updateTask(task);
    };

    _starTask = () => {
        const { favorite } = this.props;
        const task = this._getTaskShape({ favorite: !favorite });

        this._updateTask(task);
    };

    _toggleEditTask = () => {
        if (this.state.isEditing) {
            const task = this._getTaskShape({ message: this.state.message });

            this._updateTask(task);

            this._setTaskEditingState(false);
        } else {
            this.setState(
                { isEditing: true,},
                () => this.messageElement.current.focus()
            );
        }
    };

    _handleTaskChange = (event) => {
        this.setState({
            message: event.target.value,
        });
    };

    _updateTaskMessageOnKeyDown = () => {

    };

    _handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            const task = this._getTaskShape({ message: this.state.message });

            this._updateTask(task);

            this.setState({
                isEditing: false,
            });
        } else if (event.key === 'Escape') {
            this.setState({
                isEditing: false,
            });
        }
    }

    _getTaskStyles = () => {
        const { completed } = this.props;

        return cx(Styles.task, {
            [Styles.completed]: completed,
        });
    };

    render () {
        const { message, completed, favorite } = this.props;
        const iconsColor = '#3B8EF3';
        const iconsFillColor = '#fff';
        const taskStyles = this._getTaskStyles();

        return (
            <li className = { taskStyles }>
                <div className = { Styles.content }>
                    <Checkbox 
                        checked = { completed }
                        className = { Styles.toggleTaskCompletedState } 
                        color1 = { iconsColor } 
                        color2 = { iconsFillColor }
                        onClick = { this._completeTask }
                    />
                    <input 
                        type = "text" 
                        maxLength = "50" 
                        disabled = { !this.state.isEditing }
                        value = { this.state.message }
                        ref = { this.messageElement }
                        onChange = { this._handleTaskChange }
                        onKeyDown = { this._handleKeyPress }
                    />
                </div>
                <div className = { Styles.actions }>
                    <Star 
                        checked = { favorite }
                        className = { Styles.toggleTaskFavoriteState }
                        inlineBlock
                        color1 = {iconsColor} 
                        onClick = { this._starTask }
                      />
                    <Edit 
                        checked = { this.state.isEditing }
                        className = { Styles.updateTaskMessageOnClick } 
                        inlineBlock
                        color1 = {iconsColor} 
                        onClick = { this._toggleEditTask }
                    />
                    <Remove 
                        inlineBlock 
                        color1 = {iconsColor} 
                        onClick = {this._removeTask}
                    />
                </div>
            </li>
        );
    };
}
