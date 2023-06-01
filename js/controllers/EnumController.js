function getBoatTypes(successMethod, errorMethod) {
    const boatTypesPromise = fetchAny(`/types`, "GET",null)
    return unpackPromise(boatTypesPromise, successMethod, errorMethod)
}

function getFinishStates(successMethod, errorMethod) {
    const finishStatesPromise = fetchAny(`/states`, "GET",null)
    return unpackPromise(finishStatesPromise, successMethod, errorMethod)
}

function getBoatTypeDescription(boatType, successMethod, errorMethod) {
    const boatTypeDescriptionPromise = fetchAny(`/type/description/${boatType}`, "GET",null)
    return unpackPromise(boatTypeDescriptionPromise, successMethod, errorMethod)
}

function getFinishStateDescription(finishState, successMethod, errorMethod) {
    const finishStateDescriptionPromise = fetchAny(`/state/description/${finishState}`, "GET",null)
    return unpackPromise(finishStateDescriptionPromise, successMethod, errorMethod)
}

