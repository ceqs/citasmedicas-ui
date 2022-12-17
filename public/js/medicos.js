$(document).ready(function () {
    validaCboEsp();

    $("#btnGuardar").click(function () {
        guardar();
    });

    setTypeDataTableMaestra();
    getDataListado();
});

function guardar() {
    var medico = {
        id: $('#txtcodigo').val(),
        apellidos: $("#txtapellido").val(),
        nombres: $('#txtnombre').val(),
        sexo: ($('#rdgeneroM').checked ? "M" : "F"),
        fecNac: $('#txtdate').val(),
        dni: $('#txtDNI').val(),
        telefono: $('#txtphone').val(),
        email: $('#txtemail').val(),
        especialidad: {
            id: $('#cboespecialidad').val()
        }
    };

    if($('#opc').val() == "1") {
        medico.id = null;
    }

    $.ajax({
      url:"http://localhost:8084/v1/medicos",
      type:"POST",
      data:JSON.stringify(medico),
      contentType:"application/json; charset=utf-8",
      dataType:"json",
      success: function(){
        $('#modalInfoMed_moved').modal('hide');
        getDataListado();
      }
    });
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
    $("#cboespecialidad").html(resultado);
}

function limpiar() {
    $('#txtcodigo').val("0");
    $('#txtapellido').val("");
    $('#txtnombre').val("");

    $('#rdgeneroM').checked = true;
    $('#rdgeneroF').checked = false;

    $('#txtdate').val("");
    $('#txtDNI').val("");
    $('#txtphone').val("");
    $('#txtemail').val("");
    $('#cboespecialidad').val("");
}

function nuevo() {
    checkModal();
    $('#opc').val("1");
    limpiar();
    $('#modalInfoMed_moved').modal('show');
}

function editar(_id) {
    checkModal();
    $('#opc').val("2");
    limpiar();
    getData(_id);
    $('#modalInfoMed_moved').modal('show');
}

function checkModal() {
    if($('#modalInfoMed_moved').length) {
        $( "#modalInfoMed" ).remove();
    }
    else {
        $('#modalInfoMed').appendTo("body");
        $("#modalInfoMed").attr("id", "modalInfoMed_moved");
    }
}

function borrar(_id) {
    $.ajax({
      url:"http://localhost:8084/v1/medicos/"+ _id,
      type:"DELETE",
      contentType:"application/json; charset=utf-8",
      dataType:"json",
      success: function(){
        getDataListado();
      }
    });
}

function getData(_id) {
    $.getJSON("http://localhost:8084/v1/medicos/" + _id, function (response) {
        $('#txtcodigo').val(response.id);
        $('#txtapellido').val(response.apellidos);
        $('#txtnombre').val(response.nombres);
        let bgenero = (response.sexo == "M") ? true : false;

        document.getElementById("rdgeneroM").checked = bgenero;
        document.getElementById("rdgeneroF").checked = !bgenero;

        $('#txtdate').val(response.fecNac);
        
        $('#txtDNI').val(response.dni);
        $('#txtphone').val(response.telefono);
        $('#txtemail').val(response.email);
        $('#cboespecialidad').val(response.especialidad.id);
    });
}

function getDataListado() {
    $.getJSON("http://localhost:8084/v1/medicos", function (lista) {
        var resultado = "";
        tablaMaestra.destroy();
        $("#tblMaestraBody").html("");
        for (var i = 0; i < lista.length; i++) {

            resultado = "";
            resultado += "<tr>";
            resultado += "    <td>" + lista[i].id + "</td>";
            resultado += "    <td>" + lista[i].apellidos + " " + lista[i].nombres + "</td>";
            resultado += "    <td>" + lista[i].sexo + "</td>";
            resultado += "    <td>" + lista[i].fecNac + "</td>";
            resultado += "    <td>" + lista[i].dni + "</td>";
            resultado += "    <td>" + lista[i].telefono + "</td>";
            resultado += "    <td>" + lista[i].email + "</td>";
            resultado += "    <td>" + lista[i].especialidad.descripcion + "</td> ";
            resultado += "    <td><a href='#' onclick='editar(" + lista[i].id + ")'><img src='/static/images/edit.gif'/></a></td>";
            resultado += "    <td><a href='#' onclick='borrar(" + lista[i].id + ")'><img src='/static/images/eliminar.png'/></a></td>";
            resultado += "    </td>";
            resultado += "</tr>";

            $("#tblMaestraBody").append(resultado);
        }
        setTypeDataTableMaestra();
    });
}

function setTypeDataTableMaestra() {
    tablaMaestra = $('#tablaMaestra').DataTable(
            {
                "language": {
                    "sProcessing": "Procesando...",
                    "sLengthMenu": "Mostrar _MENU_ registros",
                    "sZeroRecords": "No se encontraron resultados",
                    "sEmptyTable": "Ningún dato disponible en esta tabla",
                    "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                    "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
                    "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
                    "sInfoPostFix": "",
                    "sSearch": "Buscar:",
                    "sUrl": "",
                    "sInfoThousands": ",",
                    "sLoadingRecords": "Cargando...",
                    "oPaginate": {
                        "sFirst": "Primero",
                        "sLast": "Último",
                        "sNext": "Siguiente",
                        "sPrevious": "Anterior"
                    },
                    "oAria": {
                        "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                        "sSortDescending": ": Activar para ordenar la columna de manera descendente"
                    }
                },
                "pageLength": 50,
                deferRender: true,
                scrollY: 400,
                scrollCollapse: true,
                scroller: true
            });
}