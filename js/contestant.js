document.addEventListener('DOMContentLoaded', runSailboatScript);




function runSailboatScript(){
    console.log("Starting contestant.js script...")

    setupContestantForm()
    setupContestantTable()
}



async function setupContestantForm() {


    try {
        const contestantForm = document.querySelector("#contestant-form")
        contestantForm.addEventListener("submit", handleContestantFormSubmit)

        const finishStates = await getFinishStates(null,null)
        const ddContestantStates = document.querySelector("#dd-contestant-form-state")
        ddContestantStates.innerHTML = ""

        for (let state of finishStates) {
            const stateDescriptionMessage = await getFinishStateDescription(state, null, null)
            const stateDescription = stateDescriptionMessage.message
            const stateOption = document.createElement("option")
            stateOption.textContent = stateDescription
            stateOption.state = state
            ddContestantStates.appendChild(stateOption)
        }

        const sailboats = await getSailboats(null, null)
        const ddContestantSailboats = document.querySelector("#dd-contestant-form-sailboat")
        ddContestantSailboats.innerHTML = ""

        for (let sailboat of sailboats) {
            const sailboatOption = document.createElement("option")
            sailboatOption.textContent = `Sejlbåd ${sailboat.id} - ${sailboat.type}`
            sailboatOption.sailboat = sailboat
            ddContestantSailboats.appendChild(sailboatOption)
        }

        const boatRaces = await getBoatRaces(null, null)
        const ddContestantBoatRaces = document.querySelector("#dd-contestant-form-race")
        ddContestantBoatRaces.innerHTML = ""

        for (let race of boatRaces) {
            const boatRaceOption = document.createElement("option")
            boatRaceOption.textContent = `Sejlads ${race.id} - ${race.type} - Dato: ${race.date}`
            boatRaceOption.boatRace = race
            ddContestantBoatRaces.appendChild(boatRaceOption)
        }
    } catch (error) {
        console.error("Had an error while trying to set up the Sailboat form.")
        console.error(error)
    }
}



async function handleContestantFormSubmit(event) {

    event.preventDefault()
    const contestantForm = event.target
    try {
        const contestantObject = preparePlainFormData(contestantForm, function (contestant) {
            contestant.state = getSelectedFinishState()
            contestant.sailboat = getSelectedSailboat()
            contestant.boatRace = getSelectedBoatRace()
        })
        const savedContestant = await addContestant(contestantObject, null, null)

        console.log("It was possible to POST the Contestant:", savedContestant)
        alert("Det var muligt at gemme Deltageren der nu har ID'et: '" + savedContestant.id + "'.")
        await setupContestantTable()
    } catch (error) {
        console.error("Had an error while trying to submit the Sailboat form!")
        console.error(error)
        alert(`Der var ikke muligt at tilføje Deltageren.\n${error.message}`)
    }
}


async function setupContestantTable() {

    const contestantTable = document.querySelector("#tbl-contestant")
    contestantTable.innerHTML = ""
    try {
        const contestants = await getContestants(null, null)
        for (let contestant of contestants) {
            const finishStateDescriptionMessage = await getFinishStateDescription(contestant.state, null, null)
            const finishStateDescription = finishStateDescriptionMessage.message
            const contestantBoat = contestant.sailboat
            const contestantRace = contestant.boatRace
            const boatTypeDescriptionMessage = await getBoatTypeDescription(contestantBoat.type, null, null)
            const typeDescription = boatTypeDescriptionMessage.message

            const contestantTableRow = document.createElement("tr")
            contestantTableRow.id = `tbl-row-contestant-${contestant.id}`
            contestantTableRow.contestant = contestant
            contestantTableRow.innerHTML = `
            <td>${contestant.id}</td>
            <td>${contestant.position}</td>
            <td>${finishStateDescription}</td>
            <td>${contestant.points}</td>
            <td>${contestantBoat.name}</td>
            <td>${typeDescription}</td>
            <td>${contestantRace.name}</td>
            <td>${contestantRace.date}</td>
           <td>
                <button class="btn btn-info" id="btn-get-contestant-${contestant.id}" value="${contestant.id}" style="margin-left: 15px">Vis Deltager ${contestant.id}</button>
                <button class="btn btn-danger" id="btn-del-contestant-${contestant.id}" value="${contestant.id}">Fjern Deltager ${contestant.id}</button>
           </td>
            `
            contestantTable.appendChild(contestantTableRow)
            document.querySelector( `#btn-get-contestant-${contestant.id}`).addEventListener("click", getContestantInfo)
            document.querySelector(`#btn-del-contestant-${contestant.id}`).addEventListener("click", delContestant)
// TODO Skal have fået så en Contestant kan blive rettet på, hans Afslutning tilstand og position skal kunne ændres. Der mangler så også backend PUT metode i ContestantController
        }
    } catch (error) {
        console.error("Had an error while trying to setup the Contestant Table!")
        console.error(error)
        alert(`Fejlede at tilføje en Deltager.\n${error.message}`)
    }
}



function getContestantInfo(event) {
    const contestantId = event.target.value
    getContestant(contestantId,
        function (contestant) {
            alert("Du trykkede på Contestant ID: '" + contestant.id + "'.")
        }, function (error) {
            console.error("Had en error while trying to get the info of Contestant with ID:", contestantId)
            console.error(error)
            alert(`Fejlede at få infoen fra Deltageren med ID: '${contestantId}'.`)
        })
}


function delContestant(event) {
    const contestantId = event.target.value
    deleteContestant(contestantId,
        function (contestant) {
            console.log("It was successful to delete Contestant:", contestant)
            alert("Det lykkes at slette Contestant med ID: '" + contestantId + "'.")
            setupContestantTable()
    }, function (error) {
            console.error("Tried to delete the Contestant with ID: '" + contestantId + "'.")
            console.error(error)
            alert("Det lykkes ikke at slette Contestant med ID: '" + contestantId + "'.")
        })
}


function getSelectedFinishState() {
    const ddContestantStates = document.querySelector("#dd-contestant-form-state")
    const errorMessage = "Du skal vælge en afstutnings tilstand!"
    const selectedFinishStateIndex = ddContestantStates.selectedIndex
    if (selectedFinishStateIndex >= 0) {
        return ddContestantStates.options[selectedFinishStateIndex].state
    }
    alert(errorMessage)
    throw new Error(errorMessage)
}

function getSelectedSailboat() {
    const ddContestantSailboats = document.querySelector("#dd-contestant-form-sailboat")
    const errorMessage = "Du skal vælge en Sejlbåd!"
    const selectedSailboatIndex = ddContestantSailboats.selectedIndex
    if (selectedSailboatIndex >= 0) {
        return ddContestantSailboats.options[selectedSailboatIndex].sailboat
    }
    alert(errorMessage)
    throw new Error(errorMessage)
}


function getSelectedBoatRace() {
    const ddContestantBoatRaces = document.querySelector("#dd-contestant-form-race")
    const errorMessage = "Du skal vælge et Sejlads!"
    const selectedBoatRaceIndex = ddContestantBoatRaces.selectedIndex
    if (selectedBoatRaceIndex >= 0) {
        return ddContestantBoatRaces.options[selectedBoatRaceIndex].boatRace
    }
    alert(errorMessage)
    throw new Error(errorMessage)
}