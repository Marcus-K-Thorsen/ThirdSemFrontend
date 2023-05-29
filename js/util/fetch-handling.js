
// Dette er standard URL til vores restcontrollers/backend, skift det ud, hvis backenden er på f.eks. Azure, husk det skal slutte med et '/'
const restUrl = "http://localhost:8080"


// Dette er en metode til at skabe et request object, som bruges af de andre metoder
function createRequest(method, entity) {
    const requestObject = {
        method: method,
        headers: {
            "content-type": "application/json"
        }
    }
    if (entity !== null) requestObject.body = JSON.stringify(entity)

    return requestObject
}

// Dette er en metode, de andre metoder bruger til at hente enten noget Json eller et Error object
async function fetchResponse(url, request) {
    let errorMessage = "The errorMessage has not been set yet.";
    console.log(`Will try to fetch a response from the URL: ${url} using the Request Object:`, request)
    try {
        let responseEntity = await fetch(url, request)
        console.log(`It was a success reaching the URL: ${url} and we received the Response Entity:`, responseEntity)
        let responseData = await responseEntity.json()
        console.log(`It was possible to pull out from the response the Data Object:`, responseData)

        if (responseEntity.ok) {
            console.log(`It was accepted by the URL: ${url} using the Request Method: ${request.method}`)
            return responseData
        }

        errorMessage = responseData.message
        console.error(`It was NOT accepted by the URL: '${url}' using the Request Method: '${request.method}'`)
        console.error(`Receiving from the backend the error message: '${errorMessage}'`)

        const indexOfTheActualMessage = errorMessage.indexOf(': ') + 2
        errorMessage = errorMessage.slice(indexOfTheActualMessage)

    } catch (error) {
        errorMessage = error.message
        if (error.message === "Failed to fetch") errorMessage = `Failed to establish contact to the url: '${url}'`;
        console.error(`Trying to use the method 'fetchResponse' we caught: '${error.message}'.`)
        console.error(error)
    }

    throw new Error(errorMessage)
}

// Kan bruges til Get, Post, Put og Delete
function fetchAny(fetchUrl, fetchMethod, objectBody) {
    const fullURL = restUrl + fetchUrl
    const requestObject = createRequest(fetchMethod, objectBody) // Hvis du laver fetch med en GET, så er objectBody bare null
    return fetchResponse(fullURL, requestObject)
}


// En metode, som andre metoder men også en selv kan bruge til at hente (kun GET) noget Json eller få kastet en Error, ud efter en given URL
// De næste metoder der bruges af os vil alle kunne enten give et Json objekt eller kaste en Error, altid husk at bruge catch på disse metoder
async function fetchAnyJson(url) {
    const request = createRequest("GET", null)
    return fetchResponse(url, request)
}