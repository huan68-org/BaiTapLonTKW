function kiemtra() {
    var form = document.querySelector(".contact-form");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
  
      var email = form.querySelector(".email").value;
      var name = form.querySelector(".name").value;
      var subject = form.querySelector(".subject").value;
      var EnquiryType = form.querySelector(".enquiry-type");
      var messages = form.querySelector(".messages").value;
  
      if (name == "" && email == "" && subject == "" && messages == "") {
        alert("Form must be filled out completely!");
        return;
      }
      if (name == "") {
        alert("Name must not be empty!");
        return;
      }
  
      var check_name = /^([A-ZÀ-Ỹ][a-zà-ỹ]+)( [A-ZÀ-Ỹ][a-zà-ỹ]+)*$/;
      if (!check_name.test(name)) {
        alert("Name is not valid!");
        return;
      }
  
      if (email == "") {
        alert("Email must not be empty!");
        return;
      }
      var check_email =
        /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
      if (!check_email.test(email)) {
        alert("Email is not valid!");
        return;
      }
  
      if (subject == "") {
        alert("Subject must not be empty!");
        return;
      }
      if (EnquiryType.selectedIndex == 0) {
        alert("Please select an enquiry type!");
        return;
      }
      if (messages == "") {
        alert("Messages must not be empty!");
        return;
      }
  
      alert("Form submitted successfully!");
      form.reset();
    });
  }
  
  kiemtra();
  
  function formfeedback() {
    var form1 = document.querySelector(".feedback-form");
    var btn = form1.querySelector("input[type='button']");
    btn.addEventListener("click", function () {
      var email_feedback = form1.querySelector(".email-feedback").value;
      if (email_feedback == "") {
        alert("Email must not be empty!");
        return;
      }
  
      var check_emailfeedback =
        /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
      if (!check_emailfeedback.test(email_feedback)) {
        alert("Email is not valid!");
        return;
      }
      alert("Subscribed successfully!");
      form1.reset();
    });
  }
  
  formfeedback();