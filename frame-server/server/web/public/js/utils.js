'use strict';


function submitHandlerPatient(serverUrl) {
  let invalids = FMV.validators[0].getInvalids();
  if (invalids.length === 0) {
    let  basil = new window.Basil();
    let  isThroughInvite = window.location.pathname.split('/').pop() !== "register";
    let  fName = $("#firstName") ? $("#firstName")[0].value : " ";
    let  lName = $("#lastName") ? $("#lastName")[0].value : " ";
    let  mName = $("#middleName") ? $("#middleName")[0].value : " ";
    let  email = $("#email") ? $("#email")[0].value : "";
    let  password = $("#password") ? $("#password")[0].value : "";
    let  gender = $("#gender") ? $("#gender")[0].value : "";
    let  dateOfBirth = $("#dateOfBirth") ? $("#dateOfBirth")[0].value : "";
    let  phoneNumber = $("#phoneNumber") ? $("#phoneNumber")[0].value : "";
    let  comments = $("#comments") ? $("#comments")[0].value : "";
    let tncCheckboxValue = $('#tncCheckbox') ? $('#tncCheckbox').prop('checked') : false;
    let tncAgreement = tncCheckboxValue ? 1 : 0;
    let  radiosAnswered = $(':radio:checked').size();
    let  dynInfo = {};
    for (var i = 0; i < radiosAnswered; i++) {
      //get values from divs and prepare userdata hash
      dynInfo[$(":radio:checked")[i].name] = $(":radio:checked")[i].value;
    }

    $('.multi-select input:checked').each(function () {

      //check if key exists, ie appending to array for that question
      if (dynInfo[$(this).attr('name')]) {
        //append to existing array
        dynInfo[$(this).attr('name')].push($(this).attr('value'))
      } else {
        //create new multi select key
        dynInfo[$(this).attr('name')] = [$(this).attr('value')];
      }

    });

    var dataToSend = {
      "username": email,
      "password": password,
      "firstName": fName,
      "middleName": mName,
      "lastName": lName,
      "gender": gender,
      "comments": comments,
      "dateOfBirth": dateOfBirth,
      "phoneNumber": phoneNumber,
      "dynInfo": JSON.stringify(dynInfo),
      "isThroughInvite": isThroughInvite,
      "inviteId": isThroughInvite ? window.location.pathname.split('/').reverse()[1]: " ",
      "studyId": isThroughInvite ? window.location.pathname.split('/').reverse()[0]: " ",
      "tncAgreement": tncAgreement
    };

    console.log("sending ", dataToSend);

    $.ajax({
      type: 'POST',
      url: serverUrl + "/api/signup/patient",
      data: dataToSend,
      dataType: "json",
      success: function (data, text) {
        console.log("cookie data");
        basil.set('cookie', data);
        window.location.href = serverUrl;
      },
      error: function (request, status, error) {
        console.log("request was ", request);
        var reply = request.responseText;
        console.log("reply is : ", reply);
        var replyText = (JSON.parse(reply));
        alert(replyText.message);
        console.log('failure: ', error);
        console.log("status: ", status);
      }
    });
  }
}

function submitHandlerClinician(serverUrl) {
  var invalids = FMV.validators[0].getInvalids();
  if (invalids.length === 0) {
    var basil = new window.Basil();

    var fName = $("#firstName") ? $("#firstName")[0].value : " ";
    var lName = $("#lastName") ? $("#lastName")[0].value : " ";
    var mName = $("#middleName") ? $("#middleName")[0].value : " ";
    var email = $("#email") ? $("#email")[0].value : "";
    var gender = $("#gender") ? $("#gender")[0].value : "";
    var password = $("#password") ? $("#password")[0].value : "";

    $.ajax({
      type: 'POST',
      url: serverUrl + "/api/signup/clinician",
      data: {
        "username": email,
        "firstName": fName,
        "middleName": mName,
        "lastName": lName,
        "gender": gender,
        "password": password
      },
      dataType: "json",
      success: function (data, text) {
        console.log('success');
        alertModal("Success", "Created new clinician account")
      },
      error: function (request, status, error) {
        console.log('failure');
        var reply = request.responseText;
        alertModal(reply);
      }
    });
  }
}

function logoutUser(serverurl, logouturl) {
  var basil = new window.Basil();
  var cookie = JSON.parse(basil.get('cookie'))

  $.ajax({
    type: 'DELETE',
    url: serverurl + "/api/logout",
    datatype: 'jsonp',
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', cookie.authHeader);
    },
    success: function (data) {
      basil.remove('cookie');
      window.location.href = logouturl;
    },
    error: function (request, status, error) {
      var reply = request.responseText;
      var replyText = (JSON.parse(reply));
      alert(replyText.message);
    }
  });
}

function resetPassword(serverUrl) {
  var key = $("#key")[0].value;
  var username = $("#username")[0].value;
  var newP = $("#password")[0].value;
  var confP = $("#confpass")[0].value;

  if (newP === confP) {
    $.ajax({
      type: 'POST',
      url: serverUrl + "/api/login/reset",
      data: {
        key: key,
        username: username,
        password: newP
      },
      dataType: "text",
      success: function (data) {
        window.location.href = serverUrl + "/login";
      },
      error: function (request, status, error) {
        var reply = request.responseText;
        var replyText = (JSON.parse(reply));
        alert(replyText.message);
      }
    });
  }
}

function forgotPassword(serverUrl, username) {
  var email = username;

  $.ajax({
    type: 'POST',
    url: serverUrl + "/api/login/forgot",
    data: {
      username: email
    },
    dataType: "text",
    success: function (data) {
      window.location.href = serverUrl + "/reset";
    },
    error: function (request, status, error) {
      var reply = request.responseText;
      var replyText = (JSON.parse(reply));
      alert(replyText.message);
    }
  });
}

function pushFooter() {
  $('main').css('min-height', 0);
  $('main').css('min-height', (
    $(document).height()
    - $('header').height()
    - $('.footerCopyright').height()
  ));
}


function nextClickHandler(id, serverUrl, questionsLength) {

  var invalids = FMV.validators[0].getInvalids();
  if (invalids.length == 0) {

    if ($("#Page2_ form input").length > 0) {
      if (radioValidator($("#Page2_ form input"))) {
        $("#question-error").addClass('hidden');
      } else {
        console.log('error');
        $("#question-error").removeClass('hidden');
        return;
      }
    }
  }
  var l = Ladda.create($(id)[0]);
  l.start();
  //Choose which route to hit based on current status
  if ($("#currentQuestionId").length != 0) {

    // pass the button to the next function, so that the function
    // could manipulate the button
    getNextQuestion(l, false, serverUrl);

  } else {
    if ($("#type").html() === "summary") {
      window.location.href = serverUrl;
    } else {
      console.log('l is ', l, ' serverURL is ', serverUrl, ' questionsLength ', questionsLength);
      storeUserData(l, serverUrl,questionsLength);
    }
  }
}

function getNextQuestion(laddaInstance, skip, serverUrl) {
  var basil = new window.Basil();
  var cookie = JSON.parse(basil.get('cookie'))

  //TODO implement form validations in survey user info for user data
  var questionId = $("#currentQuestionId")[0].innerText;
  var sectionId = $("#currentSectionId")[0].innerText;
  var surveyId = $("#surveyId")[0].innerText;
  var userId = cookie.session.userId;

  //If its a question, include responses data to be sent in the ajax as well.
  //At any given time apart from the initial data storage, the page should always have a flag for isDescription which will allow us to make the correct post call
  var dataToSend;
  if ($("#type").html() === "description") {
    dataToSend = {
      questionId: questionId,
      sectionId: sectionId,
      userID: userId,
      surveyId: surveyId
    }
  } else {
    if ($('input[name=answer]:checked').length > 0 && !skip) {
      //Press Next
      var choice_id = $('input[name=answer]:checked')[0].value
    } else {
      choice_id = null
    }
    dataToSend = {
      questionId: questionId,
      sectionId: sectionId,
      userID: userId,
      response: choice_id,
      surveyId: surveyId
    };
    dataToSend.isSkipped = skip;

  }
  console.log("dataToSend, serverUrl");
  console.log(dataToSend, serverUrl);

  $.ajax({
    type: 'POST',
    url: serverUrl + "/survey/nextItem",
    data: dataToSend,
    datatype: 'html',
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', cookie.authHeader);
    },
    success: function (data) {
      console.log('success');
      //replace innerhtml with this
      $("#template_head")[0].innerHTML = data;
      if ($("#type")) {
        switch ($("#type")[0].innerText) {
          case("question"): {
            $("#button-panel-with-skip").show();
            $("#button-panel-with-skip").removeClass('hidden');
            $("#button-panel-without-skip").hide();
            break;
          }
          case("summary"): {
            $("#button-panel-with-skip").hide();
            $("#button-panel-without-skip").hide();
            var scripts = $("#template_head script");
            for (var i = 0; i < scripts.length; i++) {
              eval($(scripts[i]).text());
            }
            break;
          }
          case("description"): {
            $("#button-panel-with-skip").hide();
            $("#button-panel-without-skip").show();
            break;
          }
        }
        laddaInstance.stop();
      }
    },
    error: function (request, status, error) {
      var reply = request.responseText;
      var replyText = (JSON.parse(reply));
      alert(replyText.message);
    }
  });
}

function loadChartsWithDummyData() {
  var exData_3 = {

    // labels should be the dates of the surveys (DD-MM)
    labels: ["2013", "2014", "2015", "2016", "2017", "2018"],

    datasets: [{
      backgroundColor: "rgba(172,194,132,0.4)",
      borderColor: "#ACC26D",
      pointBackgroundColor: "#fff",
      pointBorderColor: "#9DB86D",
      data: [47.5, 50, 63, 77, 82, 87], // change data to the survey score data
      label: "My score"
    }, {
      backgroundColor: "rgba(172,194,255,0.4)",
      borderColor: "#ACC2FF",
      pointBackgroundColor: "#fff",
      pointBorderColor: "#9DB86D",
      data: [50, 50, 50, 50, 50, 50], // all mean scores should be 50 for now
      label: "Mean score"
    }]
  };

  var ex3 = $('#ex3')[0].getContext('2d');
  new Chart(ex3, {
    type: 'line',
    data: exData_3
  });

  var exData_2 = {
    labels: ["2013", "2014", "2015", "2016", "2017", "2018"],
    datasets: [{
      backgroundColor: "rgba(172,194,132,0.4)",
      borderColor: "#ACC26D",
      pointBackgroundColor: "#fff",
      pointBorderColor: "#9DB86D",
      data: [60, 52, 55, 60, 70, 85],
      label: "My score"
    }, {
      backgroundColor: "rgba(172,194,255,0.4)",
      borderColor: "#ACC2FF",
      pointBackgroundColor: "#fff",
      pointBorderColor: "#9DB86D",
      data: [50, 55, 61, 65, 72, 80],
      label: "Mean score"
    }]
  }

  var ex2 = $('#ex2')[0].getContext('2d');
  new Chart(ex2, {
    type: 'line',
    data: exData_2,
    options: {
      scales: {
        yAxes: [{
          ticks: {
            max: 100,
            min: 0,
            stepSize: 5
          }
        }]
      }
    }
  });
}

function radioValidator(inputs) {
  for (var i = 0; i < inputs.length; i++) {
    if (inputs[i].type == 'radio' && inputs[i].checked) {
      return true;
    }
  }
  return false;
}

function checkLogoutTimer() {
  var basil = new window.Basil();
  var cookie = JSON.parse(basil.get('cookie')) //JSON.parse(basil.get('cookie'))
  console.log(cookie);
  var loginTime = new Date(cookie.session.time);
  var delta = Math.floor((new Date() - loginTime)/60000);
  if (delta >= 10) {
    alert()
  } else if (delta >= 15) {

  }
}

function inactivityTime(configUrl) {
    var logoutTimer, warnTimer;
    window.onload = resetTimer;
    document.onload = resetTimer;
    document.onmousemove = resetTimer;
    document.onmousedown = resetTimer; // touchscreen presses
    document.ontouchstart = resetTimer;
    document.onclick = resetTimer;     // touchpad clicks
    document.onscroll = resetTimer;    // scrolling with arrow keys
    document.onkeypress = resetTimer;

    function logout() {
      var basil = new window.Basil();
      var cookie = JSON.parse(basil.get('cookie')) //JSON.parse(SON.parse(basil.get('cookie')));
      $.ajax({
        type: 'DELETE',
        url: configUrl + "/api/logout",
        datatype: 'jsonp',
        beforeSend: function (xhr) {
          xhr.setRequestHeader('Authorization', cookie.authHeader);
        },
        success: function (data) {
          basil.remove('cookie');
          window.location.href = configUrl;
        },
        error: function (request, status, error) {
          var reply = request.responseText;
          var replyText = (JSON.parse(reply));
          alert(replyText.message);
        }
      });
    }

    function warn() {
      alertModal('Warning', 'User is inactive, session will terminate in 5 minutes');
    }

    function resetTimer() {
        clearTimeout(logoutTimer);
        clearTimeout(warnTimer);
        logoutTimer = setTimeout(logout, 900000);
        warnTimer = setTimeout(warn, 300000);
    }
};

function alertModal(titleText, bodyText, callback) {
  var modalHTML = new EJS({url: '/public/partials/alert_modal.ejs'}).render({titleText: titleText, bodyText: bodyText});
  $(modalHTML).appendTo('body');
  $("#alertModal").modal();
  $('#alertModal').show();
  $('#alertModal').on('hidden.bs.modal', function (e) {
    if (callback) callback();
    $('#alertModal').remove();
  });
}

function dateSort() {
  return function (a, b) {
    var result = (new Date(Date.parse(a.label)) < new Date(Date.parse(b.label))) ? -1 : (new Date(Date.parse(a.label)) > new Date(Date.parse(b.label))) ? 1 : 0;
    return result;
  }
}

function checkPasswordRequirements() {
  /[a-z]/.test($("#password").val()) ? $("#passReq1").css("color", "green") : $("#passReq1").css("color", "red");
  /[A-Z]/.test($("#password").val()) ? $("#passReq2").css("color", "green") : $("#passReq2").css("color", "red");
  /[0-9]/.test($("#password").val()) ? $("#passReq3").css("color", "green") : $("#passReq3").css("color", "red");
  /[!@\#$%&/=?_.,:;\\-]/.test($("#password").val()) ? $("#passReq4").css("color", "green") : $("#passReq4").css("color", "red");
  /.{10}/.test($("#password").val()) ? $("#passReq5").css("color", "green") : $("#passReq5").css("color", "red");
}

String.prototype.replaceAll = function (str1, str2, ignore) {
  return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, "\\$&"), (ignore ? "gi" : "g")), (typeof(str2) == "string") ? str2.replace(/\$/g, "$$$$") : str2);
}

function initializeScorePreviewTable() {
  //TODO to add-in when fixed
}
