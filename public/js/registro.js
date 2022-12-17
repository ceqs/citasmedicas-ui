$(document).ready(function () {
    $("#freg_numdoc").change(function() {
        $("#freg_usuario").val($("#freg_numdoc").val());
    });

    $("#btn_guardar_registro").click(function () {
        guardar();
    });
});

function guardar() {
    if($('#freg_tipodoc').val() == 0) {
        alert("Debe seleccionar un tipo de documento.");
        return;
    }

    if($('#freg_password').val() != $('#freg_rpassword').val()) {
        alert("Debe repetir el mismo password.");
        return;
    }

    var sexo;
    if($("#freg_female_gender").is(':checked')) {
        sexo = "F";
    }
    else if($("#freg_male_gender").is(':checked')) {
        sexo = "M";
    }
    else {
        sexo = "O";
    }

    var registro = {
        paciente: {
            tipoDoc: $('#freg_tipodoc').val(),
            numDoc: $('#freg_numdoc').val(),
            apePaterno: $('#freg_apepaterno').val(),
            apeMaterno: $('#freg_apematerno').val(),
            nombres: $('#freg_nombres').val(),
            email: $('#freg_email').val(),
            telefono: $('#freg_telefono').val(),
            celular: $('#freg_celular').val(),
            sexo: sexo,
            fecNac: $('#freg_fecnac').val(),
        },
        usuario: {
            usuario: $('#freg_usuario').val(),
            password: $('#freg_password').val(),
        }
    };

    $.ajax({
      url:"http://localhost:8084/v1/registros",
      type:"POST",
      data:JSON.stringify(registro),
      contentType:"application/json; charset=utf-8",
      dataType:"json",
      success: function(){
        alerta('Usuario registrado correctamente, puede ir al Login.!', 'success');
        limpiar();
      },
      error: function(e) {
        alerta(e.responseJSON.message, 'danger');
      }
    });
}

function limpiar() {
    $('#freg_tipodoc').val("0");
    $('#freg_numdoc').val("");
    $('#freg_apepaterno').val("");
    $('#freg_apematerno').val("");
    $('#freg_nombres').val("");
    $('#freg_email').val("");
    $('#freg_telefono').val("");
    $('#freg_celular').val("");
    $('#freg_fecnac').val("");
    $('#freg_usuario').val("");
    $('#freg_password').val("");
}

function alerta(message, type) {
  wrapper = document.createElement('div');
  wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    '</div>'
  ].join('');

  $('#liveAlertPlaceholder').append(wrapper);
}
