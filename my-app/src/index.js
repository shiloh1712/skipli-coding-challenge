import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class SimpleForm extends React.Component {
  
  submitFormHandler = event => {
    event.preventDefault();
    console.dir(`sending request to server for ${this.refs.phone.value}`); 
    fetch('http://localhost:8080/verify', {
      method : 'POST',
      body: JSON.stringify({
        phone: this.refs.phone.value,
        code: this.refs.code.value,
      })
    })
    .then(response => response.json())
    .then(data => {
      //display message from server
      alert(data.message)
    })
  }
  
  render() {
    return (
        <div>
          <form onSubmit={this.submitFormHandler}>
            <div>
              <input placeholder='Phone number' type="tel" name="phone" ref="phone" pattern="[0-9]{10}" required/>
              <input placeholder='6 digit Verification Code ' type="text" pattern='[0-9]{6}' ref="code"/>
              <input ref="submit" id="submit" type="submit" value="Submit"></input>
            </div>
          </form>
        </div>
    );
  }
} 

ReactDOM.render(
  <SimpleForm  />,
  document.getElementById('root')
);