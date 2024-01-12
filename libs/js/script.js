$(document).ready(function () {
  getAllPersonnel();
  getAllDepartments();
  getAllLocations();
  //modal-footer2 invisible
  $("#modal-footer2").css("display", "none")
  $("#modal-title2").css("display", "none")

  $("#loc-footer2").css("display", "none")
  $("#locTitle2").css("display", "none")

  //filter initialize
  $("#filterPersonnelByDepartment").val("0") 
  $("#filterPersonnelByLocation").val("0")

});

let getAllPsData = "";
let getAllDpData = "";
let getAllLcData = "";


const tablePersonnel = (arr) => {
let html = "";
arr.forEach(e => {
  html += `<tr><td class='align-middle text-nowrap'>${e.lastName}, ${e.firstName}</td>` 
  html += `<td class="align-middle text-nowrap d-none d-md-table-cell">${e.department}</td>`
  html += `<td class="align-middle text-nowrap d-none d-md-table-cell">${e.location}</td>`
  html += `<td class="align-middle text-nowrap d-none d-md-table-cell">${e.email}</td>`
  html += `<td class="text-end text-nowrap">`
  html += `<button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editPersonnelModal" data-id="${e.id}">`
  html += `<i class="fa-solid fa-pencil fa-fw"></i></button> `
  html += `<button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal"  data-bs-target="#areYouSurePersonnelModal" data-name="pers" data-id="${e.id}">`
  html += `<i class="fa-solid fa-trash fa-fw"></i></button></td>`
  html += '</tr>'
}); 
$("#personnelTable").append(html)
}

const tableDepartment = (arr) => {
   let html ='';
      arr.forEach(e => {
        html += `<tr><td class='align-middle text-nowrap'>${e.name}</td>` ;
        html += `<td class="align-middle text-nowrap d-none d-md-table-cell">${e.locName}</td>`
        html += `<td class="align-middle text-end text-nowrap">`
        html += `<button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editDepartmentModal" data-loc="${e.locName}" data-name="${e.name}" data-id="${e.id}">`
        html += `<i class="fa-solid fa-pencil fa-fw"></i></button> `
        html += `<button type="button" class="btn btn-primary btn-sm" onclick="deleteDepartmentBtn(${e.id})" data-name="dept" data-id="${e.id}">`
        html += `<i class="fa-solid fa-trash fa-fw"></i></button></td>`
        html += '</tr>'
      }); 
  $("#departmentsTable").append(html);
}

const tableLocation = (arr) => {
let html = "";
arr.forEach(e => {
  html += `<tr><td class='align-middle text-nowrap'>${e.name}</td>` 
  html += `<td class="align-middle text-end text-nowrap">`
  html += `<button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#addLocationModal" data-name="${e.name}" data-id="${e.id}">`
  html += `<i class="fa-solid fa-pencil fa-fw"></i></button> `
  html += `<button type="button" class="btn btn-primary btn-sm" onclick="deleteLocationBtn(${e.id})" data-name="loc" data-id="${e.id}">`
  html += `<i class="fa-solid fa-trash fa-fw"></i></button></td>`
  html += '</tr>'
}); 
$("#locationsTable").append(html);
}

const getAllPersonnel = () => {
  $.ajax({
    url: "libs/php/getAll.php",
    type: "GET",
    success: function (result) {
        const arr = result['data']
        getAllPsData = arr;
        tablePersonnel(arr);
    },
    error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
    }
  });

}

const getAllDepartments = () => {
  $.ajax({
    url: "libs/php/getAllDepartments.php",
    type: "GET",
    success: function (result) {
        const arr = result['data']
        getAllDpData = arr;
        tableDepartment(arr);
    },
    error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
    }
  }); 

};

const getAllLocations = () => {
  $.ajax({
    url: "libs/php/getAllLocations.php",
    type: "GET",
    success: function (result) {
        const arr = result['data']
        getAllLcData = arr;
        tableLocation(arr);
    },
    error: function (jqXHR) {
        console.log(jqXHR);
    }
  });
};

const resetTable = (opt) => {
  if(opt === 'per'){
    getAllPsData = "";
    $("#personnelTable").empty()
    getAllPersonnel();
  }else if(opt === 'dep'){
    getAllDpData = "";
    $("#departmentsTable").empty()
    getAllDepartments();  
  }else{
    getAllLcData = "";
    $("#locationsTable").empty()
    getAllLocations();
  }
}

$("#searchInp").on("keyup", function (e) {
  // your code
  if(e.keyCode === 13){ //Enter
      searchFilter();
  }
});

const searchFilter = () => {
  $.ajax({
    url: "libs/php/searchPersonnelByFilter.php",
    type: "POST",
    data  : {
      keyword : $("#searchInp").val(),
      department : $("#filterPersonnelByDepartment").val(),
      location : $("#filterPersonnelByLocation").val()
    },
    success: function (result) {
      getAllPsData = result.data;
      $("#personnelTable").empty()
      tablePersonnel(result.data);
      $("#filterModal").modal('hide');
    },
    error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
    }
  })
}

$("#refreshBtn").click(function () {
  //filter modal initialize 0, 0
  $("#filterPersonnelByLocation").val("0")
  $("#filterPersonnelByDepartment").val("0")
  $("#searchInp").val("")

  if ($("#personnelBtn").hasClass("active")) {
    
    // Refresh personnel table
    resetTable('per')
  } else {
    
    if ($("#departmentsBtn").hasClass("active")) {
      
      // Refresh department table
      resetTable('dep')
    } else {
      
      // Refresh location table
      resetTable('loc')
    }
    
  }
  
});

$("#filterBtn").click(function () {
  
  // Open a modal of your own design that allows the user to apply a filter to the personnel table on either department or location
  let filterDep = $("#filterPersonnelByDepartment option:selected").val()
  let filterLoc = $("#filterPersonnelByLocation option:selected").val()

  $("#filterPersonnelByDepartment option").remove();
  let html = "<option value='0'>All</option>"
  $("#filterPersonnelByDepartment").append(html);
  $.each(getAllDpData, function () {         
      $("#filterPersonnelByDepartment").append(
          $("<option>", {
              value: this.id,
              text: this.name
          })
      );
  });

  $("#filterPersonnelByLocation option").remove();
  $("#filterPersonnelByLocation").append(html);
  $.each(getAllLcData, function () {
      $("#filterPersonnelByLocation").append(
          $("<option>", {
              value: this.id,
              text: this.name
          })
      );
  });

  if(filterDep !== "0" || filterLoc !== "0"){
      console.log("here")
      $("#filterPersonnelByDepartment").val(filterDep).prop("selected", true);
      $("#filterPersonnelByLocation").val(filterLoc).prop("selected", true);
  }
});

$("#addBtn").click(function () {
  $("#addDepartmentLocations option").remove();
  $("#editPersonnelDepartment option").remove();

  
  // Replicate the logic of the refresh button click to open the add modal for the table that is currently on display
  if ($("#personnelBtn").hasClass("active")) {
      $("#modal-title1").css("display", "none")
      $("#modal-title2").css("display", "")
      $("#modal-footer1").css("display", "none")
      $("#modal-footer2").css("display", "");

      $.each(getAllLcData, function () {
          $("#addDepartmentLocations").append(
          $("<option>", {
              value: this.id,
              text: this.name
          })
          );
      });
  
      $("#editPersonnelModal").modal('show')
  }else if($("#departmentsBtn").hasClass("active")){
      $.each(getAllLcData, function () {
        $("#addDepartmentLocations").append(
          $("<option>", {
            value: this.id,
            text: this.name
          })
        );
      });
      $("#addDepartmentModal").modal('show')

    }else{
      $("#locTitle1").css("display", "none")
      $("#locTitle2").css("display", "")
      $("#loc-footer1").css("display", "none")
      $("#loc-footer2").css("display", "")
   
      $("#addLocationModal").modal('show')
    }
});

$("#personnelBtn").click(function () {
  
  $("#filterBtn").attr("disabled", false);
  // Call function to refresh presonnel table
  $("#personnelTable").empty()
  getAllPersonnel();
  
});

$("#departmentsBtn").click(function () {
  
  $("#filterBtn").attr("disabled", true);
  // Call function to refresh department table
  $("#departmentsTable").empty()
  getAllDepartments()
});

$("#locationsBtn").click(function () {
  
  $("#filterBtn").attr("disabled", true);
  // Call function to refresh location table
  $("#locationsTable").empty()
  getAllLocations()
});

$("#areYouSurePersonnelModal").on("show.bs.modal", function (e) {

  $("#deleteDataName").val($(e.relatedTarget).attr("data-name"))

  $.ajax({
    url: "libs/php/getPersonnelByID.php",
    type: "POST",
    dataType: "json",
    data: {
      id: $(e.relatedTarget).attr("data-id") // Retrieves the data-id attribute from the calling button
    },
    success: function (result) {
      var resultCode = result.status.code;

      if (resultCode == 200) {
        
        $('#areYouSurePersonnelID').val(result.data.personnel[0].id);
        $("#areYouSurePersonnelName").text(
          result.data["personnel"][0].firstName +
            " " +
            result.data["personnel"][0].lastName
        );
        } else {
        $("#areYouSurePersonnelModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#deleteEmployeeName .modal-title").replaceWith(
        "Error retrieving data"
      );
    }
  });
});

const deleteLocationBtn = (id) => {
  $.ajax({
    url:"libs/php/checkLocationUse.php",
    type: "POST",
    dataType: "json",
    data: {
      id: id // Retrieves the data-id attribute from the calling button
    },
    success: function (result) {
      if (result.status.code == 200) {
        if (result.data[0].cnt == 0) {
          $("#locationName").text(result.data[0].locationName);

          $("#deleteDataName").val("loc");
          $("#locationID").val(id);

          $("#deleteLocationModal").modal("show");

        } else {
          $("#cantDeleteLocName").text(result.data[0].locationName);
          $("#depCount").text(result.data[0].cnt);

          $("#cantDeleteLocationModal").modal("show");
        }
      } else {
        $("#exampleModal .modal-title").replaceWith("Error retrieving data");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#exampleModal .modal-title").replaceWith("Error retrieving data");
    }
  });
}

$("#editPersonnelModal").on("show.bs.modal", function (e) {
  if($(e.relatedTarget).attr("data-id") === undefined){ // addbtn
   
      $("#editPersonnelForm").each(function(){
        this.reset();
      });
      $("#editPersonnelEmployeeID").val("");

      $.each(getAllDpData, function () {
        $("#editPersonnelDepartment").append(
          $("<option>", {
            value: this.id,
            text: this.name
          })
        );
      });

    }else{ //edit
      $("#modal-title1").css("display", "")
      $("#modal-title2").css("display", "none")
      $("#modal-footer1").css("display", "")
      $("#modal-footer2").css("display", "none")

      $.ajax({
          url:"libs/php/getPersonnelByID.php",
          type: "POST",
          dataType: "json",
          data: {
            id: $(e.relatedTarget).attr("data-id") // Retrieves the data-id attribute from the calling button
          },
          success: function (result) {
            var resultCode = result.status.code;
      
            if (resultCode == 200) {
              // Update the hidden input with the employee id so that
              // it can be referenced when the form is submitted
      
              $("#editPersonnelEmployeeID").val(result.data.personnel[0].id);
      
              $("#editPersonnelFirstName").val(result.data.personnel[0].firstName);
              $("#editPersonnelLastName").val(result.data.personnel[0].lastName);
              $("#editPersonnelJobTitle").val(result.data.personnel[0].jobTitle);
              $("#editPersonnelEmailAddress").val(result.data.personnel[0].email);
      
              $("#editPersonnelDepartment").html("");
      
              $.each(result.data.department, function () {
                $("#editPersonnelDepartment").append(
                  $("<option>", {
                    value: this.id,
                    text: this.name
                  })
                );
              });
      
              $("#editPersonnelDepartment").val(result.data.personnel[0].departmentID);
              
            } else {
              $("#editPersonnelModal .modal-title").replaceWith(
                "Error retrieving data"
              );
            }
          },
          error: function (jqXHR, textStatus, errorThrown) {
            $("#editPersonnelModal .modal-title").replaceWith(
              "Error retrieving data"
            );
          }
        });
    } 
});

const deleteDepartmentBtn = (id) => {
  $.ajax({
    url:"libs/php/checkDepartmentUse.php",
    // SELECT d.name AS departmentName, COUNT(p.id) as personnelCount FROM department d LEFT JOIN personnel p ON (p.departmentID = d.id) WHERE d.id  = ?
    type: "POST",
    dataType: "json",
    data: {
      id: id // Retrieves the data-id attribute from the calling button
    },
    success: function (result) {
      if (result.status.code == 200) {
        if (result.data[0].personnelCount == 0) {
          $("#areYouSureDeptName").text(result.data[0].departmentName);

          $("#deleteDataName").val("dept");
          $("#areYouSureDepartmentID").val(id);

          $("#areYouSureDeleteDepartmentModal").modal("show");

        } else {
          $("#cantDeleteDeptName").text(result.data[0].departmentName);
          $("#personnelCount").text(result.data[0].personnelCount);

          $("#cantDeleteDepartmentModal").modal("show");
        }
      } else {
        $("#exampleModal .modal-title").replaceWith("Error retrieving data");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#exampleModal .modal-title").replaceWith("Error retrieving data");
    }
  });
}



$("#editPersonnelForm").on("submit", function (e) {
  
  // Executes when the form button with type="submit" is clicked
  // stop the default browser behviour

  e.preventDefault();

  // AJAX call to save form data
  let pId = $("#editPersonnelEmployeeID").val();

  if(pId === "" || pId === undefined){ //Add Employee
    $.ajax({
      url: "libs/php/insertPersonnel.php",
      type: "POST",
      dataType: 'json',
      data: {
          firstName :  $("#editPersonnelFirstName").val(),
          lastName : $("#editPersonnelLastName").val(),
          jobTitle : $("#editPersonnelJobTitle").val(),
          email : $("#editPersonnelEmailAddress").val(),
          departmentID : $("#editPersonnelDepartment").val(),
      },
      success: function (result) {
          resetTable('per')
          $("#editPersonnelModal").modal('hide')
      },
      error: function (jqXHR, textStatus, errorThrown) {
          console.log(jqXHR);
      }
    })
  }else{  // Edit Employee
// AJAX call to save form data
    $.ajax({
        
      url: "libs/php/updatePersonnel.php",
      type: "POST",
      dataType: 'json',
      data: {
          firstName :  $("#editPersonnelFirstName").val(),
          lastName : $("#editPersonnelLastName").val(),
          jobTitle : $("#editPersonnelJobTitle").val(),
          email : $("#editPersonnelEmailAddress").val(),
          departmentID : $("#editPersonnelDepartment").val(),
          id : $("#editPersonnelEmployeeID").val()
      },
      success: function (result) {
          resetTable('per')
          $("#editPersonnelModal").modal('hide')
      },
      error: function (jqXHR, textStatus, errorThrown) {
          console.log(jqXHR);
      }
    })
  }
  
});

$("#editDepartmentModal").on("show.bs.modal", function (e) {
  $.ajax({
    url: "libs/php/getDepartmentByID.php",
    type: "POST",
    dataType: "json",
    data: {
      id: $(e.relatedTarget).attr("data-id") // Retrieves the data-id attribute from the calling button
    },
    success: function (result) {
      $("#editDepartmentName").val(result.data[0].name)
      $("#editDepartmentID").val(result.data[0].id)
      let html = '';
      let targetName = $(e.relatedTarget).attr("data-loc");
      
      $("#editDepartmentLocations option").remove();
 
      getAllLcData.forEach((e) => {
        if(e.name === targetName){
          html += `<option value="${e.id}" selected>${e.name}</option>`
        }else{
          html += `<option value="${e.id}">${e.name}</option>`
        }
      });
      $("#editDepartmentLocations").append(html);
    },
    error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
    }
  });

 
});

$("#editDepartmentForm").on("submit", function (e) {
  e.preventDefault();

  $.ajax({
    url: "libs/php/updateDepartment.php",
    type: "POST",
    dataType: 'json',
    data: {
        name :  $("#editDepartmentName").val(),
        location : $("#editDepartmentLocations").val(),
        id : $("#editDepartmentID").val()
    },
    success: function (result) {
        resetTable('dep');
        $("#editDepartmentModal").modal('hide');
    },
    error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
    }
  })

});
$("#addDepartmentForm").on("submit", function (e) {
  e.preventDefault();

  $.ajax({
    url: "libs/php/insertDepartment.php",
    type: "POST",
    dataType: 'json',
    data: {
        name :  $("#addDepartmentName").val(),
        locationID : $("#addDepartmentLocations").val()
    },
    success: function (result) {
        resetTable('dep');
        $("#addDepartmentModal").modal('hide');
        $("#addDepartmentName").val("");
        $("#addDepartmentLocations").val("");
    },
    error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
    }
  })

});    

$("#addLocationForm").on("submit", function (e) {
  e.preventDefault();

  let id = $("#addLocationID").val();

  if(id === "" || id === undefined){ //Add 
    $.ajax({
      url: "libs/php/insertLocation.php",
      type: "POST",
      dataType: 'json',
      data: {
          name :  $("#addLocationName").val()
      },
      success: function (result) {
          resetTable('loc');
          $("#addLocationModal").modal('hide')
      },
      error: function (jqXHR, textStatus, errorThrown) {
          console.log(jqXHR);
      }
    })
  }else{
    $.ajax({
      url: "libs/php/updateLocation.php",
      type: "POST",
      dataType: 'json',
      data: {
          name :  $("#addLocationName").val(),
          id : id
      },
      success: function (result) {
          resetTable('loc');
          $("#addLocationModal").modal('hide')
      },
      error: function (jqXHR, textStatus, errorThrown) {
          console.log(jqXHR);
      }
    })
  }
});

$("#addLocationModal").on("show.bs.modal", function (e) {
  if($(e.relatedTarget).attr("data-id") === undefined){ // addbtn
   
    $("#addLocationForm").each(function(){
      this.reset();
    });
    $("#addLocationID").val("");

  }else{ //edit btn
    $("#locTitle1").css("display", "")
    $("#locTitle2").css("display", "none")
    $("#loc-footer1").css("display", "")
    $("#loc-footer2").css("display", "none")

    $.ajax({
      url: "libs/php/getLocationByID.php",
      type: "POST",
      dataType: "json",
      data: {
        id: $(e.relatedTarget).attr("data-id") // Retrieves the data-id attribute from the calling button
      },
      success: function(result){
        $("#addLocationName").val(result.data[0].name);
        $("#addLocationID").val(result.data[0].id);
      },
      error: function(){
        $("#addLocationModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      }
    })



  }
});

$("#areYouSurePersonnelForm").on("submit", function (e) {
  
  // stop the default browser behviour
  e.preventDefault();

  // AJAX call
  let dataId = $("#areYouSurePersonnelID").val();
  let dataName = $("#deleteDataName").val();
  
  console.log(dataId + " / " + dataName);

  $.ajax({
      url: "libs/php/deleteById.php",
      type: "POST",
      data  : {
        dataName : dataName,
        dataId : dataId
      },
      success: function (result) {
        if(dataName === "pers"){
          resetTable('per');
        }else if(dataName === "dept"){
          resetTable('dep');
        }else if(dataName === "loc"){
          resetTable('loc');
        }
        $("#areYouSurePersonnelModal").modal('hide')     
      },
      error: function (jqXHR, textStatus, errorThrown) {
          console.log(jqXHR);
      }
    })
});

$("#areYouSureDepartmentForm").on("submit", function (e) {
  console.log("clicked")
  // stop the default browser behviour
  e.preventDefault();

  // AJAX call
  let dataId = $("#areYouSureDepartmentID").val();
  let dataName = $("#deleteDataName").val();
  
  console.log(dataId + " / " + dataName);

  $.ajax({
      url: "libs/php/deleteById.php",
      type: "POST",
      data  : {
        dataName : dataName,
        dataId : dataId
      },
      success: function (result) {
        if(dataName === "pers"){
          resetTable('per');
        }else if(dataName === "dept"){
          resetTable('dep');
        }else if(dataName === "loc"){
          resetTable('loc');
        }
        $("#areYouSureDeleteDepartmentModal").modal('hide')     
      },
      error: function (jqXHR, textStatus, errorThrown) {
          console.log(jqXHR);
      }
    })
});
$("#deleteLocationForm").on("submit", function (e) {
  console.log("clicked")
  // stop the default browser behviour
  e.preventDefault();

  // AJAX call
  let dataId = $("#locationID").val();
  let dataName = $("#deleteDataName").val();
  
  console.log(dataId + " / " + dataName);

  $.ajax({
      url: "libs/php/deleteById.php",
      type: "POST",
      data  : {
        dataName : dataName,
        dataId : dataId
      },
      success: function (result) {
        if(dataName === "pers"){
          resetTable('per');
        }else if(dataName === "dept"){
          resetTable('dep');
        }else if(dataName === "loc"){
          resetTable('loc');
        }
        $("#deleteLocationModal").modal('hide')     
      },
      error: function (jqXHR, textStatus, errorThrown) {
          console.log(jqXHR);
      }
    })
});

$("#filterPersonnelByDepartment").change(function () {
  
    if (this.value > 0) {
      $("#filterPersonnelByLocation").val(0);
      // apply Filter
    }
    searchFilter();

})

$("#filterPersonnelByLocation").change(function () {
  
    if (this.value > 0) {
      $("#filterPersonnelByDepartment").val(0);   
      // apply Filter
    }
    searchFilter();
})