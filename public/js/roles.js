$(document).ready(function () {

    $("#btn_guardar_roles").click(function () {
        guardar();
    });

    setTypeDataTableMaestraRoles();
    getDataListadoRoles();
});

function guardar() {
    var rol = {
        id: $('#txtcodigo_roles').val(),
        nombre: $("#txtnombre_roles").val()
    };

    $.ajax({
      url:"http://localhost:8084/v1/roles",
      type:"POST",
      data:JSON.stringify(rol),
      contentType:"application/json; charset=utf-8",
      dataType:"json",
      success: function(){
        $('#modal_roles_moved').modal('hide');
        getDataListadoRoles();
      }
    });
}

function limpiar() {
    $('#txtcodigo_roles').val("");
    $('#txtnombre_roles').val("");
}

function nuevo() {
    checkModal();
    $('#opc_roles').val("1");
    limpiar();
    $('#modal_roles_moved').modal('show');
}

function editar(_id) {
    checkModal();
    $('#opc_roles').val("2");
    limpiar();
    getData(_id);
    $('#modal_roles_moved').modal('show');
}

function checkModal() {
    if($('#modal_roles_moved').length) {
        $( "#modal_roles" ).remove();
    }
    else {
        $('#modal_roles').appendTo("body");
        $("#modal_roles").attr("id", "modal_roles_moved");
    }
}

function borrar(_id) {
    $.ajax({
      url:"http://localhost:8084/v1/roles/"+ _id,
      type:"DELETE",
      contentType:"application/json; charset=utf-8",
      dataType:"json",
      success: function(){
        getDataListadoRoles();
      }
    });
}

function getData(_id) {
    $.getJSON("http://localhost:8084/v1/roles/" + _id, function (response) {
        $('#txtcodigo_roles').val(response.id);
        $('#txtnombre_roles').val(response.nombre);
    });
}

function getDataListadoRoles() {
    $.getJSON("http://localhost:8084/v1/roles", function (lista) {
        var resultado = "";
        
        if($.fn.DataTable.isDataTable('#tbl_maestra_roles')) {
             $('#tbl_maestra_roles').DataTable().destroy();
        }
        
        $("#tbl_maestra_body_roles").html("");
        for(var i = 0; i < lista.length; i++) {
            resultado = "";
            resultado += "<tr>";
            resultado += "    <td>" + i + "</td>";
            resultado += "    <td>" + lista[i].id + "</td>";
            resultado += "    <td>" + lista[i].nombre + "</td> ";
            resultado += "    <td><a href='#' onclick='editar(\"" + lista[i].id + "\")'><img src='/static/images/edit.gif'/></a></td>";
            resultado += "    <td><a href='#' onclick='borrar(\"" + lista[i].id + "\")'><img src='/static/images/eliminar.png'/></a></td>";
            resultado += "    </td>";
            resultado += "</tr>";

            $("#tbl_maestra_body_roles").append(resultado);
        }
        setTypeDataTableMaestraRoles();
    });
}

function setTypeDataTableMaestraRoles() {
    $('#tbl_maestra_roles').DataTable({
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