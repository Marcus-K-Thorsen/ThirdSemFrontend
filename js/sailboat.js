document.addEventListener('DOMContentLoaded', runSailboatScript);




function runSailboatScript(){
    console.log("Starting sailboat.js script...")

    setupSailboatForm()
    setupSailboatTable()
}


async function setupSailboatForm() {

    try {
        const sailboatForm = document.querySelector("#sailboat-form")
        sailboatForm.addEventListener("submit", handleFormSailboatSubmit)

        const boatTypes = await getBoatTypes(null,null)
        const ddBoatTypes = document.querySelector("#dd-sailboat-form-type")
        ddBoatTypes.innerHTML = ""

        for (let boatType of boatTypes) {
            const boatTypeDescriptionMessage = await getBoatTypeDescription(boatType, null, null)
            const boatTypeDescription = boatTypeDescriptionMessage.message
            const boatTypeOption = document.createElement("option")
            boatTypeOption.textContent = boatTypeDescription
            boatTypeOption.boatType = boatType
            ddBoatTypes.appendChild(boatTypeOption)
        }
    } catch (error) {
        console.error("Had an error while trying to set up the Sailboat form.")
        console.error(error)
    }
}

async function handleFormSailboatSubmit(event) {
    event.preventDefault()
    const sailboatForm = event.target
    try {
        const sailboatObject = preparePlainFormData(sailboatForm, function (sailboat) {
            sailboat.type = getSelectedBoatType()
        })
        const savedSailboat = await addSailboat(sailboatObject, null, null)
        const savedSailboatTypeDescriptionMessage = await getBoatTypeDescription(sailboatObject.type, null, null)
        const savedSailboatTypeDescription = savedSailboatTypeDescriptionMessage.message
        console.log("It was possible to POST the Sailboat:", savedSailboat)
        alert("Det var muligt at gemme sejlbåden med Typen: '" + savedSailboatTypeDescription + "' og ID'et: '" + savedSailboat.id + "'.")
        await setupSailboatTable()
    } catch (error) {
        console.error("Had an error while trying to submit the Sailboat form!")
        console.error(error)
    }
}




async function setupSailboatTable() {
    const sailboatTable = document.querySelector("#tbl-sailboats")
    const amountOfBoatsInTable = sailboatTable.children.length
    if (amountOfBoatsInTable > 0) { sailboatTable.innerHTML = "" }
    try {
        const sailboats = await getSailboats(null, null)
        for (let sailboat of sailboats) {
            const sailboatTableRow = document.createElement("tr")
            const sailboatTypeDescriptionMessage = await getBoatTypeDescription(sailboat.type, null, null)
            const sailboatTypeDescription = sailboatTypeDescriptionMessage.message
            sailboatTableRow.id = `tbl-row-sailboat-${sailboat.id}`
            sailboatTableRow.sailboat = sailboat
            sailboatTableRow.innerHTML = `
            <td>${sailboat.id}</td>
            <td><input id="tbl-inp-sailboat-${sailboat.id}" placeholder="${sailboat.name}" value="${sailboat.name}"></td>
            <td>${sailboatTypeDescription}</td>
            <td style="text-align: center">${sailboat.amountOfCompetitions}</td>
            <td>
                <button class="btn btn-info" id="btn-get-sailboat-${sailboat.id}" value="${sailboat.id}" style="margin-left: 15px">Vis Sejlbåd ${sailboat.id}</button>
                <button class="btn btn-success" id="btn-put-sailboat-${sailboat.id}" value="${sailboat.id}" style="margin-left: 15px">Update Sejlbåd ${sailboat.id}</button>
                <button class="btn btn-danger" id="btn-del-sailboat-${sailboat.id}" value="${sailboat.id}">Fjern Sejlbåd ${sailboat.id}</button>
            </td>
        `;
            sailboatTable.appendChild(sailboatTableRow)
            document.querySelector( `#btn-get-sailboat-${sailboat.id}`).addEventListener("click", getSailboatInfo)
            document.querySelector(`#btn-put-sailboat-${sailboat.id}`).addEventListener("click", putSailboat)
            document.querySelector(`#btn-del-sailboat-${sailboat.id}`).addEventListener("click", delSailboat)

        }
    } catch (error) {
        console.error("Had an error while trying to setup the Sailboat Table!")
        console.error(error)
    }
}



function getSailboatInfo(event) {
    const sailboatId = event.target.value

    getSailboat(sailboatId,
        function (sailboat) {
            console.log("Got the sailboat from the backend:", sailboat)
            alert(`
            Du klikkede på sejlbåden med ID: '${sailboat.id}\n
            Sejlbåden har navnet: ${sailboat.name}
            `)
        },
        function (error) {
            console.error("Tried to get the info from the sailboat with the ID: '" + sailboatId + "' and got an error.")
            console.error(error)
        })
}

async function putSailboat(event) {
    const sailboatId = event.target.value
    try {
        const sailboat = await getSailboat(sailboatId, null, null)
        const tblInpSailboatName = document.querySelector(`#tbl-inp-sailboat-${sailboatId}`)
        sailboat.name = tblInpSailboatName.value
        const updatedSailboat = await updateSailboat(sailboat, null, null)
        console.log("It was successful updating the Sailboat:", updatedSailboat)
        alert("Det lykkes at update sejlbåden med ID: '" + sailboatId + "'.")
        setupSailboatTable()
    } catch (error) {
        console.error("Tried to update the sailboat with the ID: '" + sailboatId + "', but got an error!")
        console.error(error)
    }
}

function delSailboat(event) {
    const sailboatId = event.target.value
    deleteSailboat(sailboatId,
        function (sailboat) {
            console.log("It was possible to delete the Sailboat:", sailboat)
            alert("Det lykkes at slette sejlbåden med ID: '" + sailboat.id + "'.")
            setupSailboatTable()
        }, function (error) {
            console.error("Tried to delete a Sailboat with the ID: '" + sailboatId + "', but caught an error!")
            console.error(error)
        })
}

function getSelectedBoatType() {
    const ddBoatTypes = document.querySelector("#dd-sailboat-form-type")
    const errorMessage = "Du skal vælge en båd type!"
    const selectedBoatTypeIndex = ddBoatTypes.selectedIndex
    if (selectedBoatTypeIndex >= 0) {
        return ddBoatTypes.options[selectedBoatTypeIndex].boatType
    }
    alert(errorMessage)
    throw new Error(errorMessage)
}