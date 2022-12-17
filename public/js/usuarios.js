$(document).ready(function () {

    $("#btn_guardar_usuario").click(function () {
        guardar();
    });

    setTypeDataTableMaestraUsuarios();
    getDataListadoUsuarios();
});

function guardar() {
    var usuario = {
        usuario: $('#txtusuario_usuario').val(),
        password: $("#txtpassword_usuario").val(),
        enabled: ($('#rdenabledsi_usuario').is(':checked') ? true: false),
        rol : {
            id: $('#cborol_usuario').val()
        }
    };

    $.ajax({
      url:"http://localhost:8084/v1/usuarios",
      type:"POST",
      data:JSON.stringify(usuario),
      contentType:"application/json; charset=utf-8",
      dataType:"json",
      success: function() {
        $('#modal_usuario_moved').modal('hide');
        getDataListadoUsuarios();
      },
      error: function(e) {
        console.log(e);
        alert(e);
      }
    });
}

function limpiar() {
    $('#txtusuario_usuario').val("");
    $('#txtpassword_usuario').val("");
    $('#cborol_usuario').val("");
    $('#rdenabledsi_usuario').prop("checked");
}

function nuevo() {
    checkModal();
    $('#opc_usuario').val("1");
    limpiar();
    $('#modal_usuario_moved').modal('show');
}

function editar(_usuario) {
    checkModal();
    $('#opc_usuario').val("2");
    limpiar();
    getData(_usuario);
    $('#modal_usuario_moved').modal('show');
}

function checkModal() {
    if($('#modal_usuario_moved').length) {
        $( "#modal_usuario" ).remove();
    }
    else {
        $('#modal_usuario').appendTo("body");
        $("#modal_usuario").attr("id", "modal_usuario_moved");
    }
}

function borrar(_usuario) {
    $.ajax({
      url:"http://localhost:8084/v1/usuarios/"+ _usuario,
      type:"DELETE",
      contentType:"application/json; charset=utf-8",
      dataType:"json",
      success: function(){
        getDataListadoUsuarios();
      }
    });
}

function getData(_usuario) {
    $.getJSON("http://localhost:8084/v1/usuarios/" + _usuario, function (response) {
        $('#txtusuario_usuario').val(response.usuario);
        $('#txtpassword_usuario').val(response.password);
        $('#cborol_usuario').val(response.rol.id);

        if(response.enabled) {
            console.log("si esta habilitado");
            $('#rdenabledsi_usuario').prop('checked', true);
            $('#rdenabledno_usuario').prop('checked', false);
        }
        else {
            console.log("no esta habilitado");
            $('#rdenabledsi_usuario').prop('checked', false);
            $('#rdenabledno_usuario').prop('checked', true);
        }
    });
}

function getDataListadoUsuarios() {
    $.getJSON("http://localhost:8084/v1/usuarios", function (lista) {
        var resultado = "";
        
        if ( $.fn.DataTable.isDataTable('#tbl_maestra_usuario') ) {
             $('#tbl_maestra_usuario').DataTable().destroy();
        }
        
        $("#tbl_maestra_body_usuario").html("");
        for (var i = 0; i < lista.length; i++) {
            resultado = "";
            resultado += "<tr>";
            resultado += "    <td>" + i + "</td>";
            resultado += "    <td>" + lista[i].usuario + "</td>";
            resultado += "    <td>" + lista[i].password.replace(/./g, '*'); + "</td> ";
            resultado += "    <td>" + lista[i].rol.id + "</td> ";
            resultado += "    <td>" + lista[i].enabled + "</td> ";
            resultado += "    <td><a href='#' onclick='editar(\"" + lista[i].usuario + "\")'><img src='/static/images/edit.gif'/></a></td>";
            resultado += "    <td><a href='#' onclick='borrar(\"" + lista[i].usuario + "\")'><img src='/static/images/eliminar.png'/></a></td>";
            resultado += "    </td>";
            resultado += "</tr>";

            $("#tbl_maestra_body_usuario").append(resultado);
        }
        setTypeDataTableMaestraUsuarios();
    });
}

function setTypeDataTableMaestraUsuarios() {
    $('#tbl_maestra_usuario').DataTable({
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