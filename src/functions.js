import * as THREE from "three";
import { state } from "./classes.js";

const parser = new DOMParser();

export function lg() {
    console.log(...arguments);
}

export function initializeDebugCamera(debugCamera, renderer) {
    debugCamera.fov = 75;
    debugCamera.aspect = renderer.domElement.clientWidth / renderer.domElement.clientHeight;
    debugCamera.near = 0.1;
    debugCamera.far = 3000;
    debugCamera.up.set(0, 1, 0);
    debugCamera.position.set(-4.5, 2.5, 5);
    debugCamera.name = "debugCamera";

    debugCamera.updateProjectionMatrix();
}

export function getIntersections(event, canvas, activeCamera, raycaster, meshesToIntersect) {
    let pointer = getPickPosition(event, canvas);
    raycaster.setFromCamera(pointer, activeCamera);
    return raycaster.intersectObjects(meshesToIntersect, true);
}

export function getCanvasRelativePosition(event, canvas) {
    const rect = canvas.getBoundingClientRect();

    return {
        x: ((event.clientX - rect.left) * canvas.width) / rect.width,
        y: ((event.clientY - rect.top) * canvas.height) / rect.height,
    };
}

export function getPickPosition(event, canvas) {
    const canvasRelativePosition = getCanvasRelativePosition(event, canvas);

    const pointer = new THREE.Vector2();
    pointer.x = (canvasRelativePosition.x / canvas.width) * 2 - 1;
    pointer.y = (canvasRelativePosition.y / canvas.height) * -2 + 1; // note we flip Y

    return pointer;
}

export function populateControlPointsToDom(domElement) {
    domElement.innerHTML = "";
    for (let point in state.controlPoints) {
        let name = state.controlPointMapping[point];
        let thisControlPoint3DObject = state.controlPoints[point];
        domElement.appendChild(
            parser
                .parseFromString(
                    `
                    <div class="wrapper">
                        <div class="name">${name}</div>
                        <div class="colorDisplay" style="background-color: #${thisControlPoint3DObject?.material.color.getHexString()};"></div>
                        <div class="radio ${point === state.activeControlPoint ? "checked" : ""}" id="${point}"></div>
                    </div>
                    `,
                    "text/html"
                )
                .getRootNode().body.firstChild
        );
    }

    // Makes the divs of Control Points behave like radio buttons
    // Also adds additional functionality where they get unchecked if clicked on twice
    let radios = document.getElementsByClassName("radio");
    for (let radio of radios) {
        radio.onclick = function (event) {
            for (let x of radios) {
                x.classList.remove("checked");
            }
            if (state.activeControlPoint === event.target.id) {
                state.activeControlPoint = undefined;
            } else {
                state.activeControlPoint = event.target.id;
                radio.classList.add("checked");
            }
        };
    }
}

function getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

export function get3DControlPoint(position, color = undefined, size = undefined) {
    let sphereGeometry = new THREE.SphereGeometry(size ? size : 0.05, 300, 300);
    let sphereMaterial = new THREE.MeshBasicMaterial({
        color: color ? color : getRandomColor(),
        depthTest: true,
    });
    let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(...position);
    return sphere;
}

export function getRandomLine(point1, point2) {
    const lineMaterial = new THREE.LineBasicMaterial({
        color: getRandomColor(),
        depthTest: false
    })
    const lineGeometry = new THREE.BufferGeometry().setFromPoints([point1, point2])
    const line = new THREE.Line(lineGeometry, lineMaterial)
    return line
}