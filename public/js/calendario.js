$(document).ready(function () {
    validaCboMed();
    
    var initialLocaleCode = 'es';

    var calendarEl = document.getElementById('calendar');

    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialDate: '2022-11-01',
        initialView: 'timeGridWeek',
        locale: initialLocaleCode,
        nowIndicator: true,
        slotDuration: '00:15:00',
        lotEventOverlap: false,
        snapDuration: '00:15:00',
        slotLabelFormat: {
            hour: 'numeric',
            minute: '2-digit',
            omitZeroMinute: false
        },
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'timeGridWeek,timeGridDay'
        },
        eventClick: function(arg) {
            if(arg.event.title == "RESERVADO") {
                editar(arg);
            }

        },
        navLinks: true, // can click day/week names to navigate views
        editable: false,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true, // allow "more" link when too many events
        events: []
    });

    calendar.render();
    calendar.today();

    $("#btnBuscar").click(function () {
        let txtI = form_historial.txtfechaI.value;
        let txtF = form_historial.txtfechaF.value;

        if (txtI == null || txtI == "") {
            alert("Debe especificar fecha Inicio");
            return;
        }

        if (txtF == null || txtF == "") {
            alert("Debe especificar fecha Fin");
            return;
        }

        var eventSources = calendar.getEventSources();
        var len = eventSources.length;
        for (var i = 0; i < len; i++) {
            eventSources[i].remove();
        }

        $.getJSON('http://localhost:8084/v1/horarios/search?medico='+$('#cboMedico').val()+'&fechaInicio='+$("#txtfechaI").val()+'&fechaFin='+$("#txtfechaF").val(), function (response) {
            calendar.addEventSource(response);
            calendar.gotoDate($("#txtfechaI").val());
        });
    });

    $("#cboEspecial").change(function () {
        let _id = form_historial.cboEspecial.value;
        //validaCboEspecial(_id);
    });

    $("#btnActualizar").click(function () {
        if($("#restadol").is(':checked')) {
            if (confirm('Desea anular la cita?')) {
                var idCita = $('#idCita').val();
                $.ajax({
                  url:"http://localhost:8084/v1/reservas/" + idCita,
                  type:"DELETE",
                  contentType:"application/json; charset=utf-8",
                  dataType:"json",
                  success: function(response){
                      alert("Cita con ticket " + idCita + " fue anulada.");
                      $('#modalInfoHorario_moved').modal('hide');
                      $('#btnBuscar').trigger('click');
                  }
                });
            }
        }
        else {
            if (confirm('Desea cambiar el estado de la cita?')) {
                var idCita = $('#idCita').val();
                    var reserva = {
                        id: idCita,
                        estado: ($("#restadoa").is(':checked')?'ATENDIDO': 'INASISTENCIA')
                    };
                    $.ajax({
                      url:"http://localhost:8084/v1/reservas",
                      type:"PUT",
                      data:JSON.stringify(reserva),
                      contentType:"application/json; charset=utf-8",
                      dataType:"json",
                      success: function(response){
                          alert("Cita con ticket " + idCita + " fue actualizada.");
                          $('#modalInfoHorario_moved').modal('hide');
                          $('#btnBuscar').trigger('click');
                      }
                    });
            }
        }
    });
});

function editar(arg) {
    checkModal();
    $('#txtestado').val(arg.event.title);
    $('#txtfecha').val(arg.event.extendedProps.fecha);
    $('#txthorainicio').val(arg.event.extendedProps.startStr);
    $('#txthorafin').val(arg.event.extendedProps.endStr);
    $('#idCita').val(arg.event.extendedProps.idCita);
    $('#idHorario').val(arg.event.extendedProps.idHorario);
    if(arg.event.title == "LIBERADO") {
        $("#restadol").prop("checked");
    }

    jQuery.noConflict();
    $('#modalInfoHorario_moved').modal('show');
}

function checkModal() {
    if($('#modalInfoHorario_moved').length) {
        $( "#modalInfoHorario" ).remove();
    }
    else {
        $("#modalInfoHorario").appendTo("body");
        $("#modalInfoHorario").attr("id", "modalInfoHorario_moved");
    }
}

function validaCboMed(){
    $.getJSON('http://localhost:8084/v1/medicos', function (response) {
        getListaMed(response);
    });
}

function getListaMed(lista){
    var resultado = "";
    resultado += "<option value=0 selected='selected'>(TODOS)</option>";
    for (var i = 0; i < lista.length; i++) {
        resultado += "<option  value=" + lista[i].id + ">" + lista[i].nombres + " " + lista[i].apellidos + "</option>";
    }
    $("#cboMedico").html(resultado);
}