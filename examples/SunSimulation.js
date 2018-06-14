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
 * Illustrates how to display a sunlight time of day simulation utilizing the atmosphere layer.
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
            // Imagery layer.
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

        // Atmosphere layer requires a date to simulate the Sun position at that time.
        // In this case the current date will be given to initialize the simulation.
        var currentTime = Date.now(), frameTime, minutesToAdvance;
        var lastFrame;

        requestAnimationFrame(runAnimation);

        function runAnimation() {
            var now = Date.now();
            if (lastFrame) {
                frameTime = now - lastFrame; // The amount of time (in milliseconds) to render each frame.

                // The amount of minutes (in milliseconds) to advance the simulation, per frame, in order to achieve
                // a constant passage of time rate of 3 hrs in simulated time per real time second, regardless of
                // frame rate.
                // At 60hz, each frame advances ~180000 ms (three simulated minutes) to achieve this rate.
                // The constant value of 10800 ms is the time to advance the simulation at 3 hrs per second
                // with an hypothetical frame time equal to 1 ms.
                // This constant increases the simulation advancement in each step, proportionally to the frame time.
                minutesToAdvance = frameTime * 10800;

                currentTime += minutesToAdvance; // Advance 3 hours in the simulation per second in real time.
                atmosphereLayer.time = new Date(currentTime); // Update the time of day in the Atmosphere layer.

                wwd.redraw(); // Update the WorldWindow scene.
            }
            lastFrame = now;
            window.requestAnimationFrame(runAnimation);
        }

        // Create a layer manager for controlling layer visibility.
        var layerManager = new LayerManager(wwd);
    });


