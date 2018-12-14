/*jshint esversion: 6 */
$(document).ready(function() {
 "use strict";

 //Initializing settings for datepicker and timepicker on form.html
 var today = new Date();
	today.setDate(today.getDate() - 1);
	console.log(today);

 $("#start-date").datepicker({
  dateFormat: "ddMyy",
  minDate: today
 });

 $('.timepicker').timepicker({
  timeFormat: 'h:mm p',
  interval: 30,
  minTime: '6:00am',
  maxTime: '5:00pm',
  startTime: '6:00am',
  dynamic: false,
  dropdown: true,
  scrollbar: true
 });

 //Clearing form error messages
 $('#errors').empty();
 $('#errors').hide();

 //FORM SUBMIT FUNCTION
 $('#form').submit(function(event) {

  event.preventDefault();

  var startDate = $('#start-date').val();
  var startTime = $('#start-time').val();
  var endTime = $('#end-time').val();

  var datePattern = /^(d{0}|(31(?!(Feb|Apr|Jun|Sep|Nov)))|((30|29)(?!Feb))|(29(?=Feb(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00)))))|(29(?=FEB(((0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00)))))|(0?[1-9])|1\d|2[0-8])(Jan|Fen|Mar|May|Apr|Jul|Jun|Aug|Oct|Sep|Nov|Dec)((1[6-9]|[2-9]\d)\d{2}|\d{2}|d{0})$/;

  var timePattern = /\b((1[0-2]|0?[1-9]):([0-5][0-9]) ([AP][M]))/;

  var stt = new Date("January 1, 2018 " + startTime);
  stt = stt.getTime();

  var endt = new Date("January 1, 2018 " + endTime);
  endt = endt.getTime();

  var error = '';

  if (datePattern.test(startDate) === false) {
   error = "Please enter a valid Start Date" + "<br/>";
  }

  if (timePattern.test(startTime) === false) {
   error += "Please enter a valid Start Time." + "<br/>";
  }

  if (timePattern.test(endTime) === false) {
   error += "Please enter a valid End Time." + "<br/>";
  }

  if (stt >= endt) {
   error += "The End Time of a class must be greater than the Start Time." + "<br/>";
  }


  if (error.length > 0) {
   $("#errors").html(error).show();
   return;
  }

  $('#errors').hide();

  //Encoding form values as an array
  var formArray = $('#form').serializeArray();

  //AJAX CALL TO POST FORM VALUES AS AN ARRAY TO FORM.PHP
  $.ajax({
    method: "POST",
    url: "form.php",
    data: formArray
   })
   .done(function(data) {
    console.log('POST Success', data);
    $('#formSuccess').modal('show');
    document.getElementById("form").reset();
   })
   .fail(function(data) {
    console.log("error", data);
   });



 }); //END FORM SUBMIT FUNCTION

 //AJAX CALL TO GET FORM VALUES SAVED IN COURSES.JSON BY FORM.PHP
 function getCourses() {
  $.ajax({
    method: "GET",
    url: "courses.json"
   })
   .done(function(data) {
    console.log('GET Success', data);

    //Formatting date and time in DataTable
    $.fn.dataTable.moment('H:mm A');
    $.fn.dataTable.moment('DDMMMYYYY');

    moment.updateLocale('en', {
     monthsShort: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
    });



//    //AJAX CALL TO POST ID OF OLD COURSES TO BE REMOVED FROM COURSES.JSON BY OLD.PHP
//    function removeOldCourses(oldCourseId) {
//     $.ajax({
//       method: "POST",
//       url: "old.php",
//       data: {
//        oldCourseId: oldCourseId
//       }
//      })
//      .done(function(data) {
//       console.log('Posting Old Course ID success', data);
//		 window.location.reload(true);
//      })
//      .fail(function(data) {
//       console.log('Posting Old Course ID failed', data);
//      });
//    }

	  //Iterates through the data array and removes old elements from array on the client side
var count = 0;
for (var i = data.length; i--;) {
     var courseDates = moment(data[i]['Start Date'], 'DDMMMYYYY').toDate();
     if (today > courseDates) {
		 count++;
//      	var oldCourseId = data[i].Activity;
      	// data.splice(i, 1);
//      	removeOldCourses(oldCourseId);
     }
    }
console.log("There are " + count + " old courses in the courses.json file");

    //CREATING DATATABLES
    var basTable = $('#bas').DataTable({

     data: data,

     "columns": [{
       "data": "Course"
      }, {
       "data": "Start Date"
      }, {
       "data": "Start Time"
      }, {
       "data": "End Time"
      }, {
       "data": "Room"
      }, {
       "data": "Activity"
      }, {
       "data": "Campus"
      }, {
       "data": "",
       "defaultContent": "<form action='delete.php' method='post' id='delete'><button type='submit' class='btn btn-danger delete' name='delete' value='delete'><i class='fa fa-trash' aria-hidden='true'></i></button></form>"
      }

     ],
     "order": [
      [1, "asc"]
     ],
     columnDefs: [{
       className: "textBold",
       "targets": [0]
      }, {
       targets: 1,
       render: $.fn.dataTable.render.moment('DDMMMYYYY')
      }, {
       targets: 5,
       "render": function(data, type, full, meta) {
        return '<a href="https://regeneron.sumtotal.host/core/pillarRedirect?relyingParty=LM&url=app%2Fmanagement%2FLMS_ActDetails.aspx%3FActivityId%' + data + '%26UserMode%3D0" class="btn btn-primary registerButtons" role="button">Register</a>';
       }
      }

     ]
  });

    var dubTable = $('#dub').DataTable({

     data: data,

     "columns": [{
      "data": "Course"
     }, {
      "data": "Start Date"
     }, {
      "data": "Start Time"
     }, {
      "data": "End Time"
     }, {
      "data": "Room"
     }, {
      "data": "Activity"
     }, {
      "data": "Campus"
     }, {
      "data": "",
      "defaultContent": "<form action='delete.php' method='post' id='delete'><button type='submit' class='btn btn-danger delete' name='delete' value='delete'><i class='fa fa-trash' aria-hidden='true'></i></button></form>"
     }],
     "order": [
      [1, "asc"]
     ],
     columnDefs: [{
      className: "textBold wordWrap",
      "targets": [0]
     }, {
      targets: 1,
      render: $.fn.dataTable.render.moment('DDMMMYYYY')
     }, {
      targets: 5,
      "render": function(data, type, full, meta) {
       return '<a href="https://regeneron.sumtotal.host/core/pillarRedirect?relyingParty=LM&url=app%2Fmanagement%2FLMS_ActDetails.aspx%3FActivityId%' + data + '%26UserMode%3D0" class="btn btn-primary registerButtons" role="button">Register</a>';
      }
     }]
 });

    var rahTable = $('#rah').DataTable({

     data: data,

     "columns": [{
      "data": "Course"
     }, {
      "data": "Start Date"
     }, {
      "data": "Start Time"
     }, {
      "data": "End Time"
     }, {
      "data": "Room"
     }, {
      "data": "Activity"
     }, {
      "data": "Campus"
     }, {
      "data": "",
      "defaultContent": "<form action='delete.php' method='post' id='delete'><button type='submit' class='btn btn-danger delete' name='delete' value='delete'><i class='fa fa-trash' aria-hidden='true'></i></button></form>"
     }],
     "order": [
      [1, "asc"]
     ],
     columnDefs: [{
      className: "textBold",
      "targets": [0]
     }, {
      targets: 1,
      render: $.fn.dataTable.render.moment('DDMMMYYYY')
     }, {
      targets: 5,
      "render": function(data, type, full, meta) {
       return '<a href="https://regeneron.sumtotal.host/core/pillarRedirect?relyingParty=LM&url=app%2Fmanagement%2FLMS_ActDetails.aspx%3FActivityId%' + data + '%26UserMode%3D0" class="btn btn-primary registerButtons"  role="button">Register</a>';
      }
     }]
    });

    var renTable = $('#ren').DataTable({

     data: data,

     "columns": [{
      "data": "Course"
     }, {
      "data": "Start Date"
     }, {
      "data": "Start Time"
     }, {
      "data": "End Time"
     }, {
      "data": "Room"
     }, {
      "data": "Activity"
     }, {
      "data": "Campus"
     }, {
      "data": "",
      "defaultContent": "<form action='delete.php' method='post' id='delete'><button type='submit' class='btn btn-danger delete' name='delete' value='delete'><i class='fa fa-trash' aria-hidden='true'></i></button></form>"
     }],
     "order": [
      [1, "asc"]
     ],
     columnDefs: [{
      className: "textBold",
      "targets": [0]
     }, {
      targets: 1,
      render: $.fn.dataTable.render.moment('DDMMMYYYY')
     }, {
      targets: 5,
      "render": function(data, type, full, meta) {
       return '<a href="https://regeneron.sumtotal.host/core/pillarRedirect?relyingParty=LM&url=app%2Fmanagement%2FLMS_ActDetails.aspx%3FActivityId%' + data + '%26UserMode%3D0" class="btn btn-primary registerButtons"  role="button">Register</a>';
      }
     }]
    });

    var tarTable = $('#tar').DataTable({

     data: data,

     "columns": [{
      "data": "Course"
     }, {
      "data": "Start Date"
     }, {
      "data": "Start Time"
     }, {
      "data": "End Time"
     }, {
      "data": "Room"
     }, {
      "data": "Activity"
     }, {
      "data": "Campus"
     }, {
      "data": "",
      "defaultContent": "<form action='delete.php' method='post' id='delete'><button type='submit' class='btn btn-danger delete' name='delete' value='delete'><i class='fa fa-trash' aria-hidden='true'></i></button></form>"
     }],
     "order": [
      [1, "asc"]
     ],
     columnDefs: [{
      className: "textBold wordWrap",
      "targets": [0]
     }, {
      targets: 1,
      render: $.fn.dataTable.render.moment('DDMMMYYYY')
     }, {
      targets: 5,
      "render": function(data, type, full, meta) {
       return '<a href="https://regeneron.sumtotal.host/core/pillarRedirect?relyingParty=LM&url=app%2Fmanagement%2FLMS_ActDetails.aspx%3FActivityId%' + data + '%26UserMode%3D0" class="btn btn-primary registerButtons" role="button">Register</a>';
      }
     }]
    });


    //This function separates the data into their appropriate tables
    $.fn.dataTable.ext.search.push(
     function(settings, data, dataIndex) {
      if (settings.nTable.id === "bas") {
       return data[6] === "Basking Ridge";
      }
      if (settings.nTable.id === "dub") {
       return data[6] === "Dublin";
      }
      if (settings.nTable.id === "rah") {
       return data[6] === "Raheen";
      }
      if (settings.nTable.id === "ren") {
       return data[6] === "Rensselaer";
      }
      if (settings.nTable.id === "tar") {
       return data[6] === "Tarrytown";
      }
     });

    basTable.draw();
    dubTable.draw();
    rahTable.draw();
    renTable.draw();
    tarTable.draw();

    deleteCoursesBas(basTable);
    deleteCoursesDub(dubTable);
    deleteCoursesRah(rahTable);
    deleteCoursesRen(renTable);
    deleteCoursesTar(tarTable);

   })
   .fail(function(data) {
    console.log("error", data);
   });
 } //END GET COURSES FUNCTION

 //FUNCTIONS TO DELETE COURSES ON INDEXADMIN.HTML
 function deleteCoursesBas(basTable) {

  $('#bas').on('click', 'tr', function() {

	   var rowData = basTable.row(this).data();
	   var activityId = rowData.Activity;
	  	var courseName = rowData.Course;



   $("form").submit(function(event) {

    event.preventDefault();

	  var r = confirm("Are you sure you want to delete this course?");
	  if (r == true) {

		alert("The following course has been deleted:\nName: " + courseName + "\nActivity ID: " + activityId);

    basTable
     .row($(this).parents('tr'))
     .remove()
     .draw();

    $.ajax({
      method: "POST",
      url: "delete.php",
      data: {
       activityId: activityId
      }
     }).done(function(data) {
      console.log('Post Success', data);
		window.location.reload(true);
     })
     .fail(function(data) {
      console.log('Post Error', data);

     });


	  }
	else {
    alert("You pressed cancel!");
	}

});
  });//END OF ROW CLICK

 }//END OF DELETE COURSES

 function deleteCoursesDub(dubTable) {

  $('#dub').on('click', 'tr', function() {

   var rowData = dubTable.row(this).data();
   var activityId = rowData.Activity;
	  var courseName = rowData.Course;

   $('form').submit(function(event) {


    event.preventDefault();

	   var r = confirm("Are you sure you want to delete this course?");
	  if (r == true) {

		alert("The following course has been deleted:\nName: " + courseName + "\nActivity ID: " + activityId);

    dubTable
     .row($(this).parents('tr'))
     .remove()
     .draw();

    $.ajax({
      method: "POST",
      url: "delete.php",
      data: {
       activityId: activityId
      }
     }).done(function(data) {
      console.log('Post Success', data);
		window.location.reload(true);
     })
     .fail(function(data) {
      console.log('Post Error', data);

     });


	  }
	else {
    alert("You pressed cancel!");
	}



   });
  });

 }

 function deleteCoursesRah(rahTable) {

  $('#rah').on('click', 'tr', function() {

   var rowData = rahTable.row(this).data();
   var activityId = rowData.Activity;
	  var courseName = rowData.Course;

   $('form').submit(function(event) {

    event.preventDefault();

	   var r = confirm("Are you sure you want to delete this course?");
	  if (r == true) {

		alert("The following course has been deleted:\nName: " + courseName + "\nActivity ID: " + activityId);

    rahTable
     .row($(this).parents('tr'))
     .remove()
     .draw();

    $.ajax({
      method: "POST",
      url: "delete.php",
      data: {
       activityId: activityId
      }
     }).done(function(data) {
      console.log('Post Success', data);
		window.location.reload(true);
     })
     .fail(function(data) {
      console.log('Post Error', data);

     });


	  }
	else {
    alert("You pressed cancel!");
	}
   });
  });

 }

 function deleteCoursesRen(renTable) {

  $('#ren').on('click', 'tr', function() {

   var rowData = renTable.row(this).data();
   var activityId = rowData.Activity;
	  var courseName = rowData.Course;

   $('form').submit(function(event) {

    event.preventDefault();

	   var r = confirm("Are you sure you want to delete this course?");
	  if (r == true) {

		alert("The following course has been deleted:\nName: " + courseName + "\nActivity ID: " + activityId);

    renTable
     .row($(this).parents('tr'))
     .remove()
     .draw();

    $.ajax({
      method: "POST",
      url: "delete.php",
      data: {
       activityId: activityId
      }
     }).done(function(data) {
      console.log('Post Success', data);
		window.location.reload(true);
     })
     .fail(function(data) {
      console.log('Post Error', data);

     });


	  }
	else {
    alert("You pressed cancel!");
	}
   });
  });

 }

 function deleteCoursesTar(tarTable) {

  $('#tar').on('click', 'tr', function() {

   var rowData = tarTable.row(this).data();
   var activityId = rowData.Activity;
	  var courseName = rowData.Course;

   $('form').submit(function(event) {

    event.preventDefault();

	   var r = confirm("Are you sure you want to delete this course?");
	  if (r == true) {

		alert("The following course has been deleted:\nName: " + courseName + "\nActivity ID: " + activityId);

    tarTable
     .row($(this).parents('tr'))
     .remove()
     .draw();

    $.ajax({
      method: "POST",
      url: "delete.php",
      data: {
       activityId: activityId
      }
     }).done(function(data) {
      console.log('Post Success', data);
		window.location.reload(true);
     })
     .fail(function(data) {
      console.log('Post Error', data);

     });


	  }
	else {
    alert("You pressed cancel!");
	}
   });
  });

 }

 getCourses();

 //Data Tables datetime render plugin
 // UMD
 (function(factory) {


   if (typeof define === 'function' && define.amd) {
    // AMD
    define(['jquery'], function($) {
     return factory($, window, document);
    });
   } else if (typeof exports === 'object') {
    // CommonJS
    module.exports = function(root, $) {
     if (!root) {
      root = window;
     }

     if (!$) {
      $ = typeof window !== 'undefined' ?
       require('jquery') :
       require('jquery')(root);
     }

     return factory($, root, root.document);
    };
   } else {
    // Browser
    factory(jQuery, window, document);
   }
  }
  (function($, window, document) {


   $.fn.dataTable.render.moment = function(from, to, locale) {
    // Argument shifting
    if (arguments.length === 1) {
     locale = 'en';
     to = from;
     from = 'DDMMMYYYY';
    } else if (arguments.length === 2) {
     locale = 'en';
    }

    return function(d, type, row) {
     var m = window.moment(d, from, locale, true);

     // Order and type get a number value from Moment, everything else
     // sees the rendered value
     return m.format(type === 'sort' || type === 'type' ? 'x' : to);
    };
   };


  }));

}); // JavaScript Document
