$(document).ready(function () {

    $("#btnGuardar_esp").click(function () {
        guardar();
    });

    setTypeDataTableMaestra();
    getDataListado();
});

function guardar() {
    var especialidad = {
        id: $('#txtcodigo_esp').val(),
        descripcion: $("#txtnombre_esp").val()
    };

    if($('#opc_esp').val() == "1") {
        especialidad.id = null;
    }

    $.ajax({
      url:"http://localhost:8084/v1/especialidades",
      type:"POST",
      data:JSON.stringify(especialidad),
      contentType:"application/json; charset=utf-8",
      dataType:"json",
      success: function(){
        $('#modalInfo_esp_moved').modal('hide');
        getDataListado();
      }
    });
}

function limpiar() {
    $('#txtcodigo_esp').val("");
    $('#txtnombre_esp').val("");
}

function nuevo() {
    checkModal();
    $('#opc_esp').val("1");
    limpiar();
    $('#modalInfo_esp_moved').modal('show');
}

function editar(_id) {
    checkModal();
    $('#opc_esp').val("2");
    limpiar();
    getData(_id);
    $('#modalInfo_esp_moved').modal('show');
}

function checkModal() {
    if($('#modalInfo_esp_moved').length) {
        $( "#modalInfo_esp" ).remove();
    }
    else {
        $('#modalInfo_esp').appendTo("body");
        $("#modalInfo_esp").attr("id", "modalInfo_esp_moved");
    }
}

function borrar(_id) {
    $.ajax({
      url:"http://localhost:8084/v1/especialidades/"+ _id,
      type:"DELETE",
      contentType:"application/json; charset=utf-8",
      dataType:"json",
      success: function(){
        getDataListado();
      }
    });
}

function getData(_id) {
    $.getJSON("http://localhost:8084/v1/especialidades/" + _id, function (response) {
        $('#txtcodigo_esp').val(response.id);
        $('#txtnombre_esp').val(response.descripcion);
    });
}

function getDataListado() {
    $.getJSON("http://localhost:8084/v1/especialidades", function (lista) {
        var resultado = "";

        if($.fn.DataTable.isDataTable('#tablaMaestra_esp')) {
             $('#tablaMaestra_esp').DataTable().destroy();
        }

        $("#tblMaestraBody_esp").html("");
        for (var i = 0; i < lista.length; i++) {
            resultado = "";
            resultado += "<tr>";
            resultado += "    <td>" + i + "</td>";
            resultado += "    <td>" + lista[i].id + "</td>";
            resultado += "    <td>" + lista[i].descripcion + "</td> ";
            resultado += "    <td><a href='#' onclick='editar(" + lista[i].id + ")'><img src='/static/images/edit.gif'/></a></td>";
            resultado += "    <td><a href='#' onclick='borrar(" + lista[i].id + ")'><img src='/static/images/eliminar.png'/></a></td>";
            resultado += "    </td>";
            resultado += "</tr>";

            $("#tblMaestraBody_esp").append(resultado);
        }
        setTypeDataTableMaestra();
    });
}

function setTypeDataTableMaestra() {
    $('#tablaMaestra_esp').DataTable({
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