const apiKey = "18923e2aa30b426eb624bd4b47f26034";
const vividliGroupId = 17171717;

//apiUrl: The base URL for the API. Find out what this is for other APIs via the API documentation
var apiUrl = "https://westus.api.cognitive.microsoft.com/face/v1.0";

var persons = getPersons(vividliGroupId);

function getPersons(groupID){
    $.ajax({
        url: `{apiUrl} + '/persongroups/' + groupID + ` ,
        beforeSend: function (xhrObj) {
            xhrObj.setRequestHeader("Content-Type", "application/octet-stream");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", apiKey);
        },
        type: "GET",
    })
}

function getGroup(groupID, callback) {
    let data;

    $.ajax({
        url: apiUrl + '/persongroups/' + groupID,
        beforeSend: function (xhrObj) {
            xhrObj.setRequestHeader("Content-Type", "application/octet-stream");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", apiKey);
        },
        type: "GET",
    })
        .done(function (response) {
            // console.log(response);
            return callback(response);
        })
        .fail(function (error) {
            return callback(error);
        });
}
function getGroup(personGroupId, callback) {
    let data;

    $.ajax({
        url: apiUrl + '/persongroups/' + personGroupId,
        beforeSend: function (xhrObj) {
            xhrObj.setRequestHeader("Content-Type", "application/octet-stream");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", apiKey);
        },
        type: "GET",
    })
        .done(function (response) {
            // console.log(response);
            return callback(response);
        })
        .fail(function (error) {
            return callback(error);
        });
}

function CallAPI(file, apiUrl, apiKey) {
    $.ajax({
        url: apiUrl,
        beforeSend: function (xhrObj) {
            xhrObj.setRequestHeader("Content-Type", "application/octet-stream");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", apiKey);
        },
        type: "POST",
        data: file,
        processData: false
    })
        .done(function (response) {
            ProcessResult(response);
        })
        .fail(function (error) {
            $("#response").text(error.getAllResponseHeaders());
        });
}

function ProcessResult(response) {
    return response;
    //$("#response").text(data);
}   