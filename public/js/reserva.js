$(document).ready(function () {

    validaCboPac();
    validaCboEsp();

    var initialLocaleCode = 'es';

    var calendarEl = document.getElementById('calendar');

    var calendar = new FullCalendar.Calendar(calendarEl, {
          initialDate: '2020-09-12',
          initialView: 'timeGridWeek',
          locale: initialLocaleCode,
          nowIndicator: true,
          selectable: false,
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
            if(arg.event.title != "RESERVADO") {
                if (confirm('Desea realizar la cita?')) {
                    var reserva = {
                        paciente: {
                            id: $('#cboPaciente').val()
                        },
                        medico: {
                            id: $('#cboMedico').val()
                        },
                        fechaCita: $("#txtfechaI").val(),
                        fhInicio: arg.event.extendedProps.startStr,
                        fhFin: arg.event.extendedProps.endStr,
                        estado: 'RESERVADO',
                        tipoCita: 'PRESENCIAL',
                        tipoSeguro: 'EPS'
                    };
                    $.ajax({
                      url:"http://localhost:8084/v1/reservas",
                      type:"POST",
                      data:JSON.stringify(reserva),
                      contentType:"application/json; charset=utf-8",
                      dataType:"json",
                      success: function(response) {
                          $("#fechaUltimaCita").val(response.fechaCita);
                          alert("Cita registrada con ticket:" + response.id);
                          $('#btnBuscar').trigger('click');
                      }
                    });
                }
            }
          },
          navLinks: true, // can click day/week names to navigate views
          editable: false,
          selectable: false,
          selectMirror: true,
          dayMaxEvents: true, // allow "more" link when too many events
          events: []
        });

        calendar.render();
        calendar.today();

    $("#btnBuscar").click(function () {
        //valida
        let txtI = form_historial.txtfechaI.value;
        //let txtF = form_historial.txtfechaF.value;
        let cboE = form_historial.cboEspecial.value;
        let cboM = form_historial.cboMedico.value;

        if (txtI == null || txtI == "") {
            alert("Debe especificar fecha Inicio");
            return;
        }
        if (cboE == 0) {
            alert("Debe seleccionar una Especialidad");
            return;
        }
        if (cboM == 0) {
            alert("Debe seleccionar un Medico");
            return;
        }

        var eventSources = calendar.getEventSources();
        var len = eventSources.length;
        for (var i = 0; i < len; i++) {
            eventSources[i].remove();
        }

        $.getJSON('http://localhost:8084/v1/horarios/search?medico='+$('#cboMedico').val()+'&fechaInicio='+$("#txtfechaI").val(), function (response) {
            calendar.addEventSource(response);
            if($("#fechaUltimaCita").val() != "") {
                calendar.gotoDate($("#fechaUltimaCita").val());
                $("#fechaUltimaCita").val("");
            }
            else {
                calendar.gotoDate($("#txtfechaI").val());
            }
        });
    });

    $("#cboEspecial").change(function () {
        let _id = form_historial.cboEspecial.value;
        validaCboEspecial(_id);
    });
});

function getAbsolutePath() {
    var loc = window.location;
    var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
    return loc.href.substring(0, loc.href.length - ((loc.pathname + loc.search + loc.hash).length - pathName.length));
}

function validaCboPac(){
    $.getJSON('http://localhost:8084/v1/pacientes', function (response) {
        getListaPac(response);
    });
}

function getListaPac(lista){
    var resultado = "";
    resultado += "<option value=0 selected='selected'>(TODOS)</option>";
    for (var i = 0; i < lista.length; i++) {
        resultado += "<option  value=" + lista[i].id + ">" + lista[i].nombres + " " + lista[i].apePaterno + " " + lista[i].apeMaterno + "</option>";
    }
    $("#cboPaciente").html(resultado);
}


function validaCboEsp(){
    $.getJSON('http://localhost:8084/v1/especialidades', function (response) {
        getListaEsp(response);
    });
}

function getListaEsp(lista){
    var resultado = "";
    resultado += "<option value=0 selected='selected'>(TODOS)</option>";
    for (var i = 0; i < lista.length; i++) {
        resultado += "<option  value=" + lista[i].id + ">" + lista[i].descripcion + "</option>";
    }
    $("#cboEspecial").html(resultado);
}


function validaCboEspecial(_id){
    $.getJSON('http://localhost:8084/v1/medicos/search?especialidad='+$('#cboEspecial').val(), function (response) {
        getListaMedxEsp(response);
    });
}

function getListaMedxEsp(lista){
    var resultado = "";
    resultado += "<option value=0 selected='selected'>(TODOS)</option>";
    for (var i = 0; i < lista.length; i++) {
        resultado += "<option  value=" + lista[i].id + ">" + lista[i].nombres + " " + lista[i].apellidos + "</option>";
    }
    $("#cboMedico").html(resultado);
}
