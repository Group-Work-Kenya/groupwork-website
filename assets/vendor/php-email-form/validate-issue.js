/**
* PHP Email Form Validation - v3.5
* URL: https://bootstrapmade.com/php-email-form/
* Author: BootstrapMade.com
*/
(function () {
  "use strict";

  let forms = document.querySelectorAll('.php-issues-form');
    console.log("FORMs", forms)

  forms.forEach( function(e) {
    e.addEventListener('submit', function(event) {
      event.preventDefault();

        let thisForm = this;
        let name = forms[0][0].value
        let email = forms[0][1].value
        let issue = forms[0][2].value
        let data={
            name:name,
            email:email,
            issue:issue,
        }

      let action = thisForm.getAttribute('action');
      let recaptcha = thisForm.getAttribute('data-recaptcha-site-key');
      
      
      if( ! action ) {
        displayError(thisForm, 'The form action property is not set!')
        return;
      }
      thisForm.querySelector('.loading').classList.add('d-block');
      thisForm.querySelector('.error-message').classList.remove('d-block');
      thisForm.querySelector('.sent-message').classList.remove('d-block');

      let formData = new FormData( thisForm );
     

      if ( recaptcha ) {
        if(typeof grecaptcha !== "undefined" ) {
          grecaptcha.ready(function() {
            try {
              grecaptcha.execute(recaptcha, {action: 'php_email_form_submit'})
              .then(token => {
                formData.set('recaptcha-response', token);
                php_issues_form_submit(thisForm, action, data);
              })
            } catch(error) {
              displayError(thisForm, error)
            }
          });
        } else {
          displayError(thisForm, 'The reCaptcha javascript API url is not loaded!')
        }
      } else {
        php_issues_form_submit(thisForm, action, data);
      }
    });
  });

  function php_issues_form_submit(thisForm, action, formData) {
        
      let data=JSON.parse(JSON.stringify(formData))
       console.log("FORM DATA SUBMIT", data)

      
    const url= "https://tusomekenya.herokuapp.com/insertIssue"
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {'Content-type': 'application/json'}
    })
    .then(response => {
        
      return response.json();
    })
    .then(data => {
       
        const {detail}=data
        
      thisForm.querySelector('.loading').classList.remove('d-block');
      if (detail == 'success') {
        thisForm.querySelector('.sent-message').classList.add('d-block');
        thisForm.reset(); 
      } else {
        throw new Error(data ? data : 'Form submission failed and no error message returned from: ' + action); 
      }
    })
    .catch((error) => {
      displayError(thisForm, error);
    });
  }

  function displayError(thisForm, error) {
    thisForm.querySelector('.loading').classList.remove('d-block');
    thisForm.querySelector('.error-message').innerHTML = error;
    thisForm.querySelector('.error-message').classList.add('d-block');
  }

})();