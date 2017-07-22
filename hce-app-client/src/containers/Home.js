import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
        };
    };

    async componentDidMount() {
        if (this.props.userToken === null) {
            return;
        }
        this.setState({ isLoading: true });
        /*try {
            const results = await this.categories();
            this.setState({ categories: results });
        }
        catch(e) {
            alert(e);
        }*/
        this.setState({ isLoading: false });
    };

     /*categories() {
     return invokeApig({ path: '/ingredientCategory' }, this.props.userToken);
     };

     renderCategoriesList(categories) {
     return [{}].concat(categories).map((category, i) => (
     i !== 0
     ? ( <ListGroupItem
     key={category.ingCatId}
     href={`/notes/${category.ingCatId}`}
     onClick={this.handleCategoryClick}
     header={category.category.trim().split('\n')[0]}>
     { "Created: " + (new Date(category.createdAt)).toLocaleString() }
     </ListGroupItem> )
     : ( <ListGroupItem
     key="new"
     href="/notes/new"
     onClick={this.handleCategoryClick}>
     <h4><b>{'\uFF0B'}</b> Create a new category</h4>
     </ListGroupItem> )
     ));
     };

     handleCategoryClick = (event) => {
     event.preventDefault();
     this.props.history.push(event.currentTarget.getAttribute('href'));
     };

     renderLander() {
     return (
     <div className="lander">
     <h1>Scratch</h1>
     <p>A simple category updating app</p>
     </div>
     );
     };

     renderCategories() {
     return (
     <div className="category">
     <PageHeader>Your Categories</PageHeader>
     <ListGroup>
     { ! this.state.isLoading
     && this.renderCategoriesList(this.state.categories) }
     </ListGroup>
     </div>
     );
     };*/

    render() {
        return (
            <div className="Home">
                {/* this.props.userToken === null
                    ? this.renderLander()
                    : this.renderCategories() */}
            </div>
        );
    };
}

export default withRouter(Home);
