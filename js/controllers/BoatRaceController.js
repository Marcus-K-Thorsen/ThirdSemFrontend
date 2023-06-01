function getBoatRaces(successMethod, errorMethod) {
    const boatRacesPromise = fetchAny(`/boatraces`, "GET", null)
    return unpackPromise(boatRacesPromise, successMethod, errorMethod)
}

function getBoatRace(boatRaceId, successMethod, errorMethod) {
    const boatRacePromise = fetchAny(`/boatrace/${boatRaceId}`, "GET", null)
    return unpackPromise(boatRacePromise, successMethod, errorMethod)
}

function addBoatRace(boatRace, successMethod, errorMethod) {
    const boatRacePostPromise = fetchAny(`/boatrace`, "POST", boatRace)
    return unpackPromise(boatRacePostPromise, successMethod, errorMethod)
}

function updateBoatRace(boatRace, successMethod, errorMethod) {
    const boatRacePutPromise = fetchAny(`/boatrace`, "PUT", boatRace)
    return unpackPromise(boatRacePutPromise, successMethod, errorMethod)
}

function deleteBoatRace(boatRaceId, successMethod, errorMethod) {
    const boatRaceDeletePromise = fetchAny(`/boatrace/${boatRaceId}`, "DELETE", null)
    return unpackPromise(boatRaceDeletePromise, successMethod, errorMethod)
}
