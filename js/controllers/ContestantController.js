function getContestants(successMethod, errorMethod) {
    const contestantsPromise = fetchAny(`/contestants`, "GET",null)
    return unpackPromise(contestantsPromise, successMethod, errorMethod)
}

function getContestant(contestantId, successMethod, errorMethod) {
    const contestantPromise = fetchAny(`/contestant/${contestantId}`, "GET",null)
    return unpackPromise(contestantPromise, successMethod, errorMethod)
}

function addContestant(contestant, successMethod, errorMethod) {
    const contestantPostPromise = fetchAny(`/contestant`, "POST",contestant)
    return unpackPromise(contestantPostPromise, successMethod, errorMethod)
}

function deleteContestant(contestantId, successMethod, errorMethod) {
    const contestantDeletePromise = fetchAny(`/contestant/${contestantId}`, "DELETE",null)
    return unpackPromise(contestantDeletePromise, successMethod, errorMethod)
}