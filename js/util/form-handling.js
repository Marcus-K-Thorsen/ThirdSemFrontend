

// Dette er en metode, som form metoderne bruger til at gøre en form om til et JSON objekt, som kan så blive postet/added til vores database
function preparePlainFormData(form, extraPreparationMethod) {
    console.log("\nMETHOD: preparePlainFormData begins...")
    console.log("Received the Form:", form)
    const formData = new FormData(form)
    console.log("Made the form in to FormData:", formData)
    const plainFormData = Object.fromEntries(formData.entries())
    if (extraPreparationMethod !== null) {
        console.log("Adding the extra attributes to the PlainFormData, using the method:", extraPreparationMethod)
        extraPreparationMethod(plainFormData)
    }
    console.log("Returns the FormData as PlainFormData:", plainFormData)
    console.log("METHOD: preparePlainFormData ends...\n")
    return plainFormData
}