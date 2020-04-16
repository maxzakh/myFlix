import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Form from 'react-bootstrap/Form';

import { actions } from '../../actions/actions';

function VisibilityFilterInput(props) {
    return <Form.Control style={{marginBottom: '.5em'}}
        onChange={e => props.setFilter(e.target.value)}
        value={props.visibilityFilter}
        placeholder= 'Filter movies'
    />;
}

export default connect(null, { setFilter: actions.setFilter })(VisibilityFilterInput);