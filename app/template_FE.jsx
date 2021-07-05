
import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {reduxForm, Field} from 'redux-form';
import {Container, Form, Button, Loader} from '@aftership/aftership-ui-react';

import {create} from 'actions/resources';
import isLoading from 'selectors/isLoading';
import {CONNECTION} from 'constants/Resources';
import {APP_CONNECTION_FORM} from 'constants/Forms';
import gridFormGroup from 'components/Form/gridFormGroup';
import {InputField} from 'components/Form/ReduxFormFields';
import {maxLength, required} from 'components/Form/validators';

const validateID = [required('Invalid ID'), maxLength(200)];

const validateApiKey = [required('Invalid ApiKey'), maxLength(100)];

const EnhancedInput = gridFormGroup(InputField);

const GeodisForm = props => (
	<Container>
		<Form horizontal onSubmit={props.handleSubmit}>
			<Field
				name="id"
				label="ID"
				validate={validateID}
				maxLength="200"
				component={EnhancedInput}
			/>
			<Field
				name="api_key"
				label="ApiKey"
				validate={validateApiKey}
				maxLength="100"
				component={EnhancedInput}
			/>
			<Field
				componentClass="div"
				name="submit"
				component={EnhancedInput}
				isStatic
				inputGrid={{sm: 4}}
				staticContent={
					<Loader isLoading={props.isLoading} fluid>
						<Button
							block
							bsStyle="primary"
							disabled={props.pristine || !props.valid}
							size="lg"
							type="submit"
						>
							Connect
						</Button>
					</Loader>
				}
			/>
		</Form>
	</Container>
);

GeodisForm.propTypes = {
	handleSubmit: PropTypes.func.isRequired,
	isLoading: PropTypes.bool.isRequired,
	pristine: PropTypes.bool.isRequired,
	valid: PropTypes.bool.isRequired,
};

const transformPayload = formdata => ({
	credentials: {
		id: formdata.id,
		api_key: formdata.api_key,
	},
	slug: 'geodis-api',
});

const mapStatesToProps = state => ({
	isLoading: isLoading(state, CONNECTION),
});

const mapDispatchToProps = {
	onSubmit: formdata => create(CONNECTION)(transformPayload(formdata)),
};

export default connect(
	mapStatesToProps,
	mapDispatchToProps
)(
	reduxForm({
		form: APP_CONNECTION_FORM,
	})(GeodisForm)
);