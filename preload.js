window.addEventListener('DOMContentLoaded', () => {
    let App = require("./build-js/app.js")
    let app = new App.default()
    let canvas = document.getElementById('canvas')
    let gl = canvas.getContext('webgl')
    if (!gl) {
        console.log("WEBGL FAILED")
    } else {
        let fpsElem = document.getElementById("fps");
        app.setGL(gl, canvas.clientWidth, canvas.clientHeight)
        app.setShowFPSCallback(function(fps) {
            fpsElem.innerText = fps.toFixed(1) + ""
        })
        app.run();
    }
})

