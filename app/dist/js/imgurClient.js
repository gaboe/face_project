 function deleteFromImgur(id) {
    $.ajax({
        url: `https://api.imgur.com/3/image/${id}`,
        type: "DELETE",
        headers: {
            "Authorization": "Client-ID fc6ae3b018fe066"
        }
    }).fail((e)=>console.log(JSON.stringify(e)));
}

function postToImgur() {
    var formData = new FormData();
    formData.append("image", ($('#photo').attr('src')).replace(/^data:image\/(png|jpg);base64,/, ""));
    return $.ajax({
        url: "https://api.imgur.com/3/image",
        type: "POST",
        datatype: "json",
        headers: {
            "Authorization": "Client-ID fc6ae3b018fe066"
        },
        data: formData,
        success: function (response) {
        },
        cache: false,
        contentType: false,
        processData: false
    });
}