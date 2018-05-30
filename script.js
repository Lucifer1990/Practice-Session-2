// Handle all the logics once the document is ready
$(document).ready(function () {
    // here you need to handle and implement all the logics for new insurance and renew insurance requirements.
    // Try to leverange the power of jQuery to do the DOM manipulation to achieve the requirements.
    // id "#insurance" in index.html should load the insurance template on DOM ready
    $("#insurance").load('./views/insurance.html');

    $("body").on("click", "#exampleRadios1", function () {
        populateList('ddCarType', 'http://localhost:3000/api/common/getCarModels');
        populateList('ddFuelType', 'http://localhost:3000/api/common/getFuelType');
        populateList('ddRegistrationState', 'http://localhost:3000/api/common/getRegStateCodes');
    });

    $("body").on("click", "#btnSubmit", function () {
        ValidateForm();
    });

    $("body").on("click", "#btnSelectPlan", function () {
        submitForm();
    });
});

function populateList(id, url) {
    $.ajax({
        type: "GET",
        crossdomain: true,
        url: url,
        beforeSend: function () {
            $('.loader').removeClass('d-none');
        },
        complete: function () {
            $('.loader').addClass('d-none');
        },
        success: function (resp, status) {
            $('#' + id).find('option').remove();
            $('#' + id).append($('<option>', {
                'value': '',
                'text': 'Please Select'
            }));

            $.each(resp.data, function (i, item) {
                $('#' + id).append($('<option>', {
                    'value': i,
                    'text': item
                }));
            });
            $("#btnSubmit, select, input[type='text'], input[type='tel']").removeAttr("disabled");
        },
        error: function (resp, status) {

        }
    });
}

function ValidateForm() {
    if ($('#ddCarType').val() == '') {
        alert('Please select Car Type');
        return false;
    }
    if ($('#ddFuelType').val() == '') {
        alert('Please select Fuel Type');
        return false;
    }
    if ($('#ddRegistrationState').val() == '') {
        alert('Please select Registration State');
        return false;
    }
    var regex = /^[A-Za-z\s]{2,15}$/;
    if (!regex.test($('#txtUserName').val())) {
        alert('Please Enter a valid name with minimum 2 and maximum 15 characters.');
        return false;
    }

    regex = /^[0-9]{10}$/;
    if (!regex.test($('#txtPhoneNumber').val())) {
        alert('Please Enter a valid mobile number(10 digit)');
        return false;
    }

    $('#formPart').addClass("d-none");
    $('#dragPart').removeClass("d-none");

    getPlanValues();
}

function getPlanValues() {
    $.ajax({
        type: "GET",
        crossdomain: true,
        url: "http://localhost:3000/api/getQuotes",
        success: function (resp, status) {
            $.each(resp.data, function (i, item) {
                var div = '<div class="drag card mb-1 p-1" draggable="true" ondragstart="dragStart(event)" data-name="' + item.name + '" id="' + i + '" data-price="' + item.price + '"><div class="card-body"><h5 class="card-title text-uppercase">' + item.name + '</h5><h6 class="card-subtitle mb-2 text-muted"> Rs. ' + item.price + '</h6></div></div>';
                $('#div1').append(div);
            });
        },
        error: function (resp, status) {

        }
    });
}

function drop(e, type) {
    var div = e.dataTransfer.getData("text");
    if (type == 2 && $('#div2').find('.drag').length >= 1) {
        return false;
    }
    if (e.target.id !== 'div1' && e.target.id !== 'div2')
        return false;
    e.target.append(document.getElementById(div));
}

function dragOver(e) {
    e.preventDefault();
}

function dragStart(e) {
    e.dataTransfer.setData("text", e.target.id);
}

function submitForm() {
    var data = {
        "userName": $('#txtUserName').val(),
        "phoneNumber": $('#txtPhoneNumber').val(),
        "carType": $('#ddCarType').val(),
        "fuelType": $('#ddFuelType').val(),
        "registrationState": $('#ddRegistrationState').val(),
        "plan": {
            "name": $($('#div2').find('.drag')[0]).data("name"),
            "price": $($('#div2').find('.drag')[0]).data("price")
        }
    };

    $.ajax({
        type: "POST",
        url: "http://localhost:3000/api/addInsurance",
        crossdomain: true,
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (resp, status) {
            $('#myModal').find('#msg').html("<p class='text-success'><strong>You have successfully bought the insurance. Your policy number is " + resp.data.policyNumber + ".</strong></p>");
            $('#myModal').modal('show');
        },
        error: function (resp, status) {

        }
    });
}

