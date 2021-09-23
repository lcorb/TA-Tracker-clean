import React from 'react';
import './form.css';

export default class StaffDetailsForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstname: props.data.firstname,
            lastname: props.data.lastname,
            mis: props.data.mis
        };
  
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }
  
    handleSubmit(event) {
        event.preventDefault();
        this.props.onSubmit(this.state);
    }
  
    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    First Name
                    <input type="text" name='firstname'  value={this.state.firstname} onChange={this.handleChange} autoFocus/>
                </label>
                <label>
                    Last Name
                    <input type="text" name='lastname' value={this.state.lastname} onChange={this.handleChange} />
                </label>
                <label>
                    MIS
                    <input type="text" name='mis' value={this.state.mis} onChange={this.handleChange} />
                </label>
                <input type="submit" value="Submit" />
            </form>
        );
      }
  }



//   import { Formik, Form, Field, ErrorMessage } from 'formik';

//     const Basic = () => (
//         <div>
//         <h1>Any place in your app!</h1>
//         <Formik
//             initialValues={{ email: '', password: '' }}
//             validate={values => {
//                 const errors = {};
//                 if (!values.email) {
//                     errors.email = 'Required';
//                 } else if (
//                     !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
//                 ) {
//                 errors.email = 'Invalid email address';
//                 }
//             return errors;
//             }}
//             onSubmit={(values, { setSubmitting }) => {
//             setTimeout(() => {
//                 alert(JSON.stringify(values, null, 2));
//                 setSubmitting(false);
//                 }, 400);
//             }}
//         >
//         {({ isSubmitting }) => (
//             <Form>
//                 <Field type="email" name="email" />
//                 <ErrorMessage name="email" component="div" />
//                 <Field type="password" name="password" />
//                 <ErrorMessage name="password" component="div" />
//                 <button type="submit" disabled={isSubmitting}>
//                     Submit
//                 </button>
//             </Form>
//         )}
//         </Formik>
//     </div>
//   );
  
//   export default Basic;