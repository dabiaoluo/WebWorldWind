/*
 * Copyright 2015-2017 WorldWind Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Illustrates how to display a day/night cycle simulation utilizing the atmosphere layer.
 */
requirejs(['./WorldWindShim',
        './LayerManager'],
    function (WorldWind,
              LayerManager) {
        "use strict";

        // Tell WorldWind to log only warnings and errors.
        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        // Create the WorldWindow.
        var wwd = new WorldWind.WorldWindow("canvasOne");

        // Create and add layers to the WorldWindow.
        var layers = [
            // Imagery layers.
            {layer: new WorldWind.BMNGLayer(), enabled: true},
            {layer: new WorldWind.BMNGOneImageLayer(), enabled: true},
            // WorldWindow UI layers.
            {layer: new WorldWind.CompassLayer(), enabled: false},
            {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: false},
            {layer: new WorldWind.ViewControlsLayer(wwd), enabled: false}
        ];

        for (var l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            wwd.addLayer(layers[l].layer);
        }

        // The Sun simulation is a feature of Atmosphere layer. We'll create and add the layer.
        var atmosphereLayer = new WorldWind.AtmosphereLayer();
        wwd.addLayer(atmosphereLayer);

        // The atmosphere layer has the option of displaying the night side of the globe when a date is set to its
        // time property.
        // We will showcase this with a day/night cycle animation.
        var lastFrame, timeToAdvance, frameTime, now, simulationDate;

        simulationDate = Date.now(); // Begin the simulation at the current time as provided by the browser.

        requestAnimationFrame(runAnimation);

        function runAnimation() {
            now = Date.now();
            if (lastFrame) {
                frameTime = now - lastFrame; // The amount of time taken to render each frame.

                // The amount of time to advance the simulation, per frame, in order to achieve a constant
                // rate of 3 hrs per real time second, regardless of frame rate.
                // The constant value of 10800 ms is the time to advance at the aforementioned rate assuming an
                // hypothetical frame time equal to 1 ms (frame time is typically ~16 ms at 60Hz).
                // Thus, simulation advancement is modulated in each step, proportionally to the frame time.
                timeToAdvance = frameTime * 10800;

                simulationDate += timeToAdvance; // Advance the simulation time.

                // Update the date of the Atmosphere layer.
                atmosphereLayer.time = new Date(simulationDate);
                wwd.redraw(); // Update the WorldWindow scene.
            }
            lastFrame = now;
            requestAnimationFrame(runAnimation);
        }

        // Create a layer manager for controlling layer visibility.
        var layerManager = new LayerManager(wwd);
    });


