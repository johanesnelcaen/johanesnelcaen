/**
* PHP Email Form Validation - v3.10 (Modified for Formspree)
* Original: https://bootstrapmade.com/php-email-form/
* Modified by: ---
*/
(function () {
  "use strict";

  let forms = document.querySelectorAll('.php-email-form');

  forms.forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      let thisForm = this;
      let action = thisForm.getAttribute('action');
      let recaptcha = thisForm.getAttribute('data-recaptcha-site-key');

      if (!action) {
        displayError(thisForm, 'The form action property is not set!');
        return;
      }

      thisForm.querySelector('.loading')?.classList.add('d-block');
      thisForm.querySelector('.error-message')?.classList.remove('d-block');
      thisForm.querySelector('.sent-message')?.classList.remove('d-block');

      let formData = new FormData(thisForm);

      if (recaptcha) {
        if (typeof grecaptcha !== "undefined") {
          grecaptcha.ready(function () {
            grecaptcha.execute(recaptcha, { action: 'php_email_form_submit' })
              .then(token => {
                formData.set('g-recaptcha-response', token);
                submitForm(thisForm, action, formData);
              })
              .catch(error => displayError(thisForm, error));
          });
        } else {
          displayError(thisForm, 'The reCaptcha javascript API url is not loaded!');
        }
      } else {
        submitForm(thisForm, action, formData);
      }
    });
  });

  function submitForm(thisForm, action, formData) {
    fetch(action, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      thisForm.querySelector('.loading')?.classList.remove('d-block');

      if (data.ok) {
        thisForm.querySelector('.sent-message')?.classList.add('d-block');
        thisForm.reset();

        // Redirection Formspree si définie
        // if (data.next) {
        //   setTimeout(() => {
        //     window.location.href = data.next;
        //   }, 1000);
        // }

      } else {
        throw new Error('Form submission failed');
      }
    })
    .catch(error => {
      displayError(thisForm, error.message || error);
    });
  }

  function displayError(thisForm, error) {
    thisForm.querySelector('.loading')?.classList.remove('d-block');
    let errorDiv = thisForm.querySelector('.error-message');
    if (errorDiv) {
      errorDiv.innerHTML = error;
      errorDiv.classList.add('d-block');
    }
  }

})();
