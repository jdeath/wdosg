const confirmDelete = () => {
    var gameId = $("#gameIdDelete").val();
    $("#gameIdDelete").val("");
    $.ajax({
        url: `/api/delete?gameId=${gameId}`,
        type: 'DELETE',
        success: function(result) {
            $('#confirmDeleteModal').modal("hide");
            $("#gamesListLink").trigger("click");
            appendInfo('Game removed');
        }
    });
}

const openDeleteConfirmation = (gameId) => {
    $("#gameIdDelete").val(gameId);
    const confirmDeleteModal = new bootstrap.Modal('#confirmDeleteModal', {});
    confirmDeleteModal.show();
}
