// Dette er standard URL til vores restcontrollers/backend, skift det ud, hvis backenden er på f.eks. Azure, husk det skal slutte med et '/'
const restUrl = "http://localhost:8080/"

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
    let errorMessage;
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
        const indexOfTheActualMessage = errorMessage.indexOf(': ') + 2
        const actualErrorMessage = errorMessage.slice(indexOfTheActualMessage)

        console.error(`It was NOT accepted by the URL: '${url}' using the Request Method: '${request.method}'`)
        console.error(`Receiving from the backend the error message: '${errorMessage}'`)
        errorMessage = actualErrorMessage

    } catch (error) {
        if (error.message === "Failed to fetch") error.message = `Failed to establish contact to the backend/rest-url: ${restUrl}`;
        errorMessage = error.message
        console.error(`Trying to use the method 'fetchResponse' we caught the Error: '${errorMessage}'`)
    }
    return new Error(errorMessage)
}

// En metode, som andre metoder men også en selv kan bruge til at hente (kun GET) noget Json eller få kastet en Error, ud efter en given URL
// De næste metoder der bruges af os vil alle kunne enten give et Json objekt eller kaste en Error, altid husk at bruge catch på disse metoder
async function fetchAnyJson(url) {
    const request = createRequest("GET", null)
    const fetchedResponse = await fetchResponse(url, request)
    if (fetchedResponse instanceof Error) {
        throw new Error(fetchedResponse.message)
    }
    return fetchedResponse
}

// En metode som vi bruger til at hente et object fra vores database eller få kastet en Error, via vores rest URL
// Giv metoden navnet for den klasse objektet kommer fra og det ID som objektet har
function getLocalEntity(entityClassName, entityID) {
    const restGetUrl = restUrl + entityClassName + "/" + entityID
    return fetchAnyJson(restGetUrl)
}

// En metode som vi bruger til at hente et attribut felt for et specifikt object fra vores database via vores rest URL
// Giv metoden navnet for klassen, objektets ID og navnet på den attribut der ønskes fra et object
function getLocalEntityAttribute(entityClassName, entityID, attributeName) {
    const restGetUrl = restUrl + entityClassName + "/" + entityID + "/" + attributeName
    return fetchAnyJson(restGetUrl)
}

// En metode som vi bruger til at hente en liste af objekter fra vores database via vores rest URL
// Giv metoden navnet på klassen i flertal for de objekter der ønskes
function getLocalEntities(entitiesClassName) {
    const entitiesLocalUrl = restUrl + entitiesClassName
    return fetchAnyJson(entitiesLocalUrl)
}

// En metode som vi bruger til at tilføje et nyt object til vores database via vores rest URL
// Giv metoden navnet på klassen, som det nye object kommer fra, samt objektet selv
async function postLocalEntity(entityClassName, entity) {
    const restPostUrl = restUrl + entityClassName
    const postRequest = createRequest("POST", entity)
    console.log(`Will try to 'POST', to the url: '${restPostUrl}', a/an '${entityClassName}':`, entity)

    const postResponse = await fetchResponse(restPostUrl, postRequest)
    if (postResponse instanceof Error) {
        const errorMessage = postResponse.message
        console.error(`Failed to 'POST' to the URL: '${restPostUrl}' which gave back the Error: ${postResponse.message}`)
        throw new Error(errorMessage)
    }
    console.log(`It was a success to 'POST' the: '${entityClassName}' which resulted in receiving the object:`, postResponse)
    return postResponse
}

// Dette er en metode som vi bruger til at kunne tilføje en form med et nyt object inde i sig til vores database via vores rest URL
// Husk at give navnet på klassen som objektet kommer fra og form elementet selv.
function postLocalForm(entityClassName, form) {
    return postLocalFormWithMethod(entityClassName, form, null)
}

// Denne metode er ligesom den over, men objektet inde i form elementet har behov for nogle ekstra attributter, som formen ikke kan indeholde
// Husk at give navnet på klassen som objektet kommer fra, form elementet og den ekstra metode, som vil give objektet de ekstra attributter
// Vigtigt er at den ekstra metode kan tage imod det object det vil tilføjes i sidste ende.
// Ekstra metoden skal være i samme js fil som hvor du kalder postLocalFormWithMethod metoden fra, den er ikke i denne js fil
async function postLocalFormWithMethod(entityClassName, form, extraMethod) {
    let plainFormData;
    let url;
    let postRequest;
    if (extraMethod !== null) {plainFormData = preparePlainFormDataWithMethod(form, extraMethod)}
    else {plainFormData = preparePlainFormData(form)}
    if (form.action !== document.referrer) {url = form.action}
    else {url = restUrl + entityClassName}

    postRequest = createRequest("POST", plainFormData)
    console.log(`Will try to 'POST' add to the URL: '${url}' a Form containing a/an '${entityClassName}' Object:`, plainFormData)
    const postResponse = await fetchResponse(url, postRequest)
    if (postResponse instanceof Error) {
        const errorMessage = postResponse.message
        console.error(`Failed to 'POST' to the URL: '${url}' which gave back the Error: ${errorMessage}`)
        throw new Error(errorMessage)
    }
    console.log(`Success to 'POST' the form to the URL: '${url}', which gave back the Object:`, postResponse)
    return postResponse
}


// Denne metode er en vi bruger til at update et allerede eksisterende object i vores database via vores rest URL
// Husk at give metoden navnet på klassen objektet kommer fra og det objektet der ønskes at blive opdateret
async function updateLocalEntity(entityClassName, entity) {
    const restUpdateUrl = restUrl + entityClassName
    const putRequest = createRequest("PUT", entity)
    console.log(`Will try to 'PUT' update to the URL: '${restUpdateUrl}' a/an '${entityClassName}' Object:`, entity)
    const putResponse = await fetchResponse(restUpdateUrl, putRequest)

    if (putResponse instanceof Error) {
        const errorMessage = putResponse.message
        console.error(`Failed to 'PUT' to the URL: '${restUpdateUrl}' which gave back the Error: ${errorMessage}`)
        throw new Error(errorMessage)
    }
    console.log(`Success to 'PUT' to the URL: '${restUpdateUrl}', which gave back the Object:`, putResponse)
    return putResponse
}

// Denne metode er en vi bruger til at kunne fjerne et allerede eksisterende object i vores database via vores rest URL
// Husk at give metoden navnet på klassen objektet kommer fra og objektet der ønskes at blive fjernet
async function deleteLocalEntity(entityClassName, entity) {
    const restDeleteUrl = restUrl + entityClassName
    const deleteRequest = createRequest("DELETE", entity)
    console.log(`Will try to 'DELETE' to the URL: '${restDeleteUrl}' a/an '${entityClassName}' Object:`, entity)
    const deleteResponse = await fetchResponse(restDeleteUrl, deleteRequest)
    if (deleteResponse instanceof Error) {
        const errorMessage = deleteResponse.message
        console.error(`Failed to 'DELETE' to the URL: '${restDeleteUrl}' which gave back the Error: ${errorMessage}`)
        throw new Error(errorMessage)
    }
    console.log(`Success to 'DELETE' to the URL: '${restDeleteUrl}', which gave back the Object:`, deleteResponse)
    return deleteResponse
}


// Dette er en metode, som form metoderne bruger til at gøre en form om til et JSON objekt, som kan så blive postet/added til vores database
function preparePlainFormData(form) {
    console.log("Received the Form:", form)
    const formData = new FormData(form)
    console.log("Made the form in to FormData:", formData)
    const plainFormData = Object.fromEntries(formData.entries())
    console.log("Changes and returns the FormData as PlainFormData:", plainFormData)
    return plainFormData
}

// Den samme metode som ovenover, men med en ekstra metode som vil kunne give objektet de attributter som form elementet ikke kan holde
function preparePlainFormDataWithMethod(form, extraPreparationMethod) {
    const plainFormData = preparePlainFormData(form)
    console.log("Adding the extra attributes to the PlainFormData, using the method:", extraPreparationMethod)
    extraPreparationMethod(plainFormData)
    console.log("Returns the finished PlainFormData:", plainFormData)
    return plainFormData
}