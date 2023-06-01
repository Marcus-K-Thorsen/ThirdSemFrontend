function getSailboats(successMethod, errorMethod) {
    const sailboatPromise = fetchAny(`/sailboats`, "GET",null)
    return unpackPromise(sailboatPromise, successMethod, errorMethod)
}

function getSailboat(sailboatId, successMethod, errorMethod) {
    const sailboatPromise = fetchAny(`/sailboat/${sailboatId}`, "GET",null)
    return unpackPromise(sailboatPromise, successMethod, errorMethod)
}

function addSailboat(sailboat, successMethod, errorMethod) {
    const sailboatPostPromise = fetchAny(`/sailboat`, "POST",sailboat)
    return unpackPromise(sailboatPostPromise, successMethod, errorMethod)
}

function updateSailboat(sailboat, successMethod, errorMethod) {
    const sailboatPutPromise = fetchAny(`/sailboat`, "PUT",sailboat)
    return unpackPromise(sailboatPutPromise, successMethod, errorMethod)
}

function deleteSailboat(sailboatId, successMethod, errorMethod) {
    const sailboatDeletePromise = fetchAny(`/sailboat/${sailboatId}`, "DELETE",null)
    return unpackPromise(sailboatDeletePromise, successMethod, errorMethod)
}