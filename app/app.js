const apiKey = "18923e2aa30b426eb624bd4b47f26034";
const vividliGroupId = 17171717;
const gaboId = '9a6ac3ab-ec6a-4025-b1e1-533c833f30cd';
//apiUrl: The base URL for the API. Find out what this is for other APIs via the API documentation
var apiUrl = "https://westus.api.cognitive.microsoft.com/face/v1.0";


var persons;

makeblob = function (dataURL) {
    var BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) == -1) {
        var parts = dataURL.split(',');
        var contentType = parts[0].split(':')[1];
        var raw = decodeURIComponent(parts[1]);
        return new Blob([raw], { type: contentType });
    }
    var parts = dataURL.split(BASE64_MARKER);
    var contentType = parts[0].split(':')[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;

    var uInt8Array = new Uint8Array(rawLength);

    for (var i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], { type: contentType });
}

function isPersonInGroup(personId, callback = function () { }, groupId = vividliGroupId) {
    getPersons(persons => {
        callback(_.findWhere(persons, { personId: personId }));
    }, groupId);
}

function getPerson(callback = function () { }, groupId = vividliGroupId) {
    getPersons(persons => {
        getPersonId(personIdData => {
            if (personIdData === 0) return callback({
                name: 'We have not found nobody with this face',
                personId: 0
            });

            callback(_.findWhere(persons, { personId: personIdData[0].candidates[0].personId }));
        });
    });
}

//runs function which will make face in group recognizable
function trainGroup(callback = function () { }, groupId = vividliGroupId) {
    return $.ajax({
        url: `${apiUrl}/persongroups/${groupId}/train`,
        beforeSend: function (xhrObj) {
            xhrObj.setRequestHeader("Content-Type", "application/json");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", apiKey);
        },
        type: "POST"
    }).always(() => callback());
}


function getPersonId(callback = function () { }, groupId = vividliGroupId) {
    trainGroup(() => {
        getFaceId((function (data) {
            if (data[0] === undefined)
                return callback(0);
            const faceId = data[0].faceId;
            return $.ajax({
                url: `${apiUrl}/identify`,
                beforeSend: function (xhrObj) {
                    xhrObj.setRequestHeader("Content-Type", "application/json");
                    xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", apiKey);
                },
                data: JSON.stringify({
                    personGroupId: groupId,
                    faceIds: [faceId]
                }),
                type: "POST",
            }).always(function (response) {
                callback(response);
            });
        }));
    })

}

function getFaceId(callback = function () { }, groupId = vividliGroupId) {
    return $.when(postToImgur()).then(function (response) {

        $.ajax({
            url: `${apiUrl}/detect?returnFaceId=${returnFaceId}&returnFaceLandmarks=${returnFaceLandmarks}`,
            beforeSend: function (xhrObj) {
                xhrObj.setRequestHeader("Content-Type", "application/json");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", apiKey);
            },
            data: JSON.stringify({ url: photoUrl }),
            type: "POST",
        }).always(function (response) {
            deleteFromImgur(photoId);
            callback(response);
        });
    });
}


function getFaceId(callback = function () { }, returnFaceId = true, returnFaceLandmarks = true) {
    return $.when(postToImgur()).then(function (response) {
        var photoUrl = response.data.link;
        var photoId = response.data.deletehash;
        $.ajax({
            url: `${apiUrl}/detect?returnFaceId=${returnFaceId}&returnFaceLandmarks=${returnFaceLandmarks}`,
            beforeSend: function (xhrObj) {
                xhrObj.setRequestHeader("Content-Type", "application/json");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", apiKey);
            },
            data: JSON.stringify({ url: photoUrl }),
            type: "POST",
        }).always(function (response) {
            deleteFromImgur(photoId);
            callback(response);
        });
    });
}

function addPersonFace(personId, groupId = vividliGroupId) {
    // let blob = ($('#photo').attr('src')).replace(/^data:image\/(png|jpg);base64,/, "");//makeblob($('#photo').attr('src'));
    //'http://www.thewrap.com/wp-content/uploads/2015/11/Donald-Trump.jpg';
    $.when(postToImgur()).then(function (response) {
        var photoUrl = response.data.link;
        var photoId = response.data.deletehash;
        return $.ajax({
            url: `${apiUrl}/persongroups/${groupId}/persons/${personId}/persistedFaces`,
            beforeSend: function (xhrObj) {
                xhrObj.setRequestHeader("Content-Type", "application/json");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", apiKey);
            },
            data: JSON.stringify({ url: photoUrl }),
            type: "POST",
        }).done(function (response) {
            $("#face-add-info").text(response);
        }).fail(function (error) {
            $("#face-add-info").text(JSON.stringify(error));
        }).always(function () {
            deleteFromImgur(photoId);
        });
    });
}


function getPersons(callback = function () { }, groupId = vividliGroupId) {
    return $.ajax({
        url: `${apiUrl}/persongroups/${groupId}/persons`,
        beforeSend: function (xhrObj) {
            xhrObj.setRequestHeader("Content-Type", "application/octet-stream");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", apiKey);
        },
        type: "GET"
    }).done(function (data) { return callback(data) });
}

function getGroup(groupID, callback) {
    $.ajax({
        url: `${apiUrl}/persongroups/${groupID}`,
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
