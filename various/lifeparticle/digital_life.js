function changeAlgo(value) {
    var oldScript = document.getElementById("life_algorithm")
    document.body.removeChild(oldScript)
    var newScript = document.createElement("script")
    newScript.src = "gameoflife/" + value + ".js"
    newScript.innerHTML = null
    newScript.id = "life_algorithm"
    document.body.appendChild(newScript)
}