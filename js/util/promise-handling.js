

function unpackPromise(promise, succesMethod, errorMethod) {
    promise.then(data => {
        console.log("Successfully unpacked a promise and received the Data:", data)
        console.log("Will use the succesMethod(data):", succesMethod)
        succesMethod(data)
    }).catch(error => {
        console.error("Caught an error while unpacking a Promise: " + error.message)
        console.log("Will use the errorMethod(error):", errorMethod)
        errorMethod(error);
    })
}
