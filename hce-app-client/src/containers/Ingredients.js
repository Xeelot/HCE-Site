import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { invokeApig, s3Upload } from '../libs/awsLib';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import LoaderButton from '../components/LoaderButton';
import config from '../config.js';
import './Ingredients.css';

class Ingredients extends Component {
    constructor(props) {
        super(props);
        this.file = null;
        this.state = {
            isLoading: null,
            isDeleting: null,
            object: null,
            category: '',
        };
    };

    async componentDidMount() {
        try {
            const results = await this.getCategory();
            this.setState({
                object: results,
                category: results.category,
            });
        }
        catch(e) {
            alert(e);
        }
    };

    getCategory() {
        return invokeApig({ path: `/ingredientCategory/${this.props.match.params.ingCatId}` }, this.props.userToken);
    };

    validateForm() {
        return this.state.category.length > 0;
    };

    formatFilename(str) {
        return (str.length < 50)
            ? str
            : str.substr(0, 20) + '...' + str.substr(str.length - 20, str.length);
    };

    handleChange = (event) => {
        this.setState({
            [event.target.id]: event.target.value
        });
    };

    handleFileChange = (event) => {
        this.file = event.target.files[0];
    };

    saveNote(category) {
        return invokeApig({
            path: `/ingredientCategory/${this.props.match.params.ingCatId}`,
            method: 'PUT',
            body: category,
        }, this.props.userToken);
    };

    handleSubmit = async (event) => {
        let uploadedFilename;

        event.preventDefault();

        if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
            alert('Please pick a file smaller than 5MB');
            return;
        }

        this.setState({ isLoading: true });

        try {

            if (this.file) {
                uploadedFilename = (await s3Upload(this.file, this.props.userToken)).Location;
            }

            await this.saveNote({
                ...this.state.object,
                category: this.state.category,
            });
            this.props.history.push('/');
        }
        catch(e) {
            alert(e);
            this.setState({ isLoading: false });
        }
    };

    deleteNote() {
        return invokeApig({
            path: `/ingredientCategory/${this.props.match.params.ingCatId}`,
            method: 'DELETE',
        }, this.props.userToken);
    };

    handleDelete = async (event) => {
        event.preventDefault();

        const confirmed = window.confirm('Are you sure you want to delete this note?');

        if ( ! confirmed) {
            return;
        }

        this.setState({ isDeleting: true });

        try {
            await this.deleteNote();
            this.props.history.push('/');
        }
        catch(e) {
            alert(e);
            this.setState({ isDeleting: false });
        }
    };

    render() {
        return (
            <div className="Notes">
                { this.state.object &&
                ( <form onSubmit={this.handleSubmit}>
                    <FormGroup controlId="category">
                        <FormControl
                            onChange={this.handleChange}
                            value={this.state.category}
                            componentClass="textarea" />
                    </FormGroup>
                    { this.state.object.attachment &&
                    ( <FormGroup>
                        <ControlLabel>Attachment</ControlLabel>
                        <FormControl.Static>
                            <a target="_blank" rel="noopener noreferrer" href={ this.state.object.attachment }>
                                { this.formatFilename(this.state.object.attachment) }
                            </a>
                        </FormControl.Static>
                    </FormGroup> )}
                    <FormGroup controlId="file">
                        { ! this.state.object.attachment &&
                        <ControlLabel>Attachment</ControlLabel> }
                        <FormControl
                            onChange={this.handleFileChange}
                            type="file" />
                    </FormGroup>
                    <LoaderButton
                        block
                        bsStyle="primary"
                        bsSize="large"
                        disabled={ ! this.validateForm() }
                        type="submit"
                        isLoading={this.state.isLoading}
                        text="Save"
                        loadingText="Saving…" />
                    <LoaderButton
                        block
                        bsStyle="danger"
                        bsSize="large"
                        isLoading={this.state.isDeleting}
                        onClick={this.handleDelete}
                        text="Delete"
                        loadingText="Deleting…" />
                </form> )}
            </div>
        );
    };
}

export default withRouter(Ingredients);