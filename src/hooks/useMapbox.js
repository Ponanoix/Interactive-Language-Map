import { useEffect, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import { checkWebGLSupport, handleMapError } from '../utils/mapboxUtils';
import { AddExportButton } from '../components/buttons/ExportMapButton';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import mapboxglGeocoder from '@mapbox/mapbox-gl-geocoder';

mapboxgl.accessToken = 'pk.eyJ1IjoicG9uYW5vaXgiLCJhIjoiY20yb3kwemVkMGt3MTJrczlwbjBmYmJ4ZiJ9.F7UndLXDlTla3G6cgbRhRA';

export const useMapbox = (mapContainerId,
                          mapConfig,
                          languageLayers,
                          languagesLayerVisible,
                          groupLayers,
                          groupLayersVisible,
                          branchLayers,
                          branchLayersVisible,
                          subdivisionLayers,
                          subdivisionLayersVisible,
                          familyLayers,
                          familyLayersVisible) => {
    const [isWebGLSupported, setWebGLSupported] = useState(true);

    useEffect(() => {
        if (!checkWebGLSupport()) {
            setWebGLSupported(false);
            return;
        }

        const mapContainer = document.getElementById(mapContainerId);
        if (!mapContainer) {
            console.error('Map container not found.');
            return;
        }

        try {
            const map = new mapboxgl.Map({
                container: mapContainerId,
                style: mapConfig.style,
                center: mapConfig.center,
                zoom: mapConfig.zoom,
                preserveDrawingBuffer: true,
            });

            map.on('style.load', () => {

                map.addControl(new mapboxgl.NavigationControl(), 'top-right');

                AddExportButton(map);

                const geocoder = new mapboxglGeocoder({
                    accessToken: mapboxgl.accessToken,
                    mapboxgl: mapboxgl,
                    placeholder: 'Search for a location or layer'
                });

                map.addControl(geocoder, 'top-left');

                const toggleLanguageLayerVisibility = () => {
                    for (let i = 0; i < languageLayers.length; i++) {
                        if (languagesLayerVisible) {
                            map.setLayoutProperty(languageLayers[i], 'visibility', 'visible');
                        } else {
                            map.setLayoutProperty(languageLayers[i], 'visibility', 'none');
                        }
                    }
                };

                const toggleGroupLayerVisibility = () => {
                    for (let i = 0; i < groupLayers.length; i++) {
                        if (groupLayersVisible) {
                            map.setLayoutProperty(groupLayers[i], 'visibility', 'visible');
                        } else {
                            map.setLayoutProperty(groupLayers[i], 'visibility', 'none');
                        }
                    }
                };

                const toggleBranchLayerVisibility = () => {
                    for (let i = 0; i < branchLayers.length; i++) {
                        if (branchLayersVisible) {
                            map.setLayoutProperty(branchLayers[i], 'visibility', 'visible');
                        } else {
                            map.setLayoutProperty(branchLayers[i], 'visibility', 'none');
                        }
                    }
                };

                const toggleSubdivisionLayerVisibility = () => {
                    for (let i = 0; i < subdivisionLayers.length; i++) {
                        if (subdivisionLayersVisible) {
                            map.setLayoutProperty(subdivisionLayers[i], 'visibility', 'visible');
                        } else {
                            map.setLayoutProperty(subdivisionLayers[i], 'visibility', 'none');
                        }
                    }
                };

                const toggleFamilyLayerVisibility = () => {
                    for (let i = 0; i < familyLayers.length; i++) {
                        if (familyLayersVisible) {
                            map.setLayoutProperty(familyLayers[i], 'visibility', 'visible');
                        } else {
                            map.setLayoutProperty(familyLayers[i], 'visibility', 'none');
                        }
                    }
                };

                toggleLanguageLayerVisibility();
                toggleGroupLayerVisibility();
                toggleBranchLayerVisibility();
                toggleSubdivisionLayerVisibility();
                toggleFamilyLayerVisibility();

                map.on('data', () => {
                    if (map.isStyleLoaded()) {
                        toggleLanguageLayerVisibility();
                        toggleGroupLayerVisibility();
                        toggleBranchLayerVisibility();
                        toggleSubdivisionLayerVisibility();
                        toggleFamilyLayerVisibility();
                    }
                });

                map.on('click', (e) => {

                    const languageFeatures = map.queryRenderedFeatures(e.point, { layers: languageLayers });
                    if (languageFeatures.length) {
                        let popupContent = '<div style="display: flex; flex-direction: column;">';
                        languageFeatures.forEach((feature) => {
                            if (!feature || !feature.properties) return;
                            const { name, family, centum_satem, branch, group, state, country_code } = feature.properties;

                            popupContent +=
                                `<div class="popup-item-languages">
                                    <div class="text-container-languages">
                                        <h1>${name}</h1>
                                        <p><strong>Group:</strong> ${group}</p>
                                        <p><strong>Branch:</strong> ${branch}</p>
                                        <p><strong>Centum/Satem:</strong> ${centum_satem}</p>
                                        <p><strong>Family:</strong> ${family}</p>
                                    </div>
                                    <div class="flag-container">
                                        <img 
                                            src="https://flagcdn.com/w320/${country_code}.png" 
                                            alt="Flag of ${state}"
                                        />
                                        <p>Flag of ${state}</p>
                                    </div>
                                </div>`;
                        });
                        popupContent += '</div>';

                        new mapboxgl.Popup()
                            .setLngLat(e.lngLat)
                            .setHTML(popupContent)
                            .addTo(map);
                    }

                    const groupFeatures = map.queryRenderedFeatures(e.point, { layers: groupLayers });
                    if (groupFeatures.length) {
                        let popupContent = '<div style="display: flex; flex-direction: column;">';

                        groupFeatures.forEach((feature) => {
                            if (!feature || !feature.properties) return;
                            const { group, branch, centum_satem, family, languages } = feature.properties;

                            let languagesArray = [];
                            try {
                                if (typeof languages === 'string') {
                                    languagesArray = JSON.parse(languages);
                                } else if (Array.isArray(languages)) {
                                    languagesArray = languages;
                                }
                            } catch (e) {
                                console.error('Error parsing languages:', e);
                            }
                            const languagesString = languagesArray.join(', ');

                            let imageSrc = "/images/icons/favicon.ico";
                            if (group === "West-germanic") {
                                imageSrc = "/images/groups/west-germanic.png";
                            } else if (group === "Western-romance") {
                                imageSrc = "/images/groups/western-romance.png";
                            } else if (group === "South-romance") {
                                imageSrc = "/images/groups/south-romance.png";
                            }

                            popupContent +=
                                `<div class="popup-item-groups">
                                    <div class="image-container">
                                        <img 
                                            src="${imageSrc}" 
                                            alt="Group Image"
                                        />
                                    </div>
                                    <div class="text-container-groups">
                                        <h1>${group}</h1>
                                        <p><strong>Branch:</strong> ${branch}</p>
                                        <p><strong>Centum/Satem:</strong> ${centum_satem}</p>
                                        <p><strong>Family:</strong> ${family}</p>
                                    </div>
                                    <div class="image-container">
                                        <img 
                                            src="${imageSrc}" 
                                            alt="Group Image"
                                        />
                                    </div>
                                    <div class="groups-container-languages">
                                        <p1><strong>Languages:</strong> ${languagesString}</p1>
                                    </div>
                                </div>`;
                        });

                        popupContent += '</div>';

                        new mapboxgl.Popup()
                            .setLngLat(e.lngLat)
                            .setHTML(popupContent)
                            .addTo(map);
                    }

                    const branchFeatures = map.queryRenderedFeatures(e.point, { layers: branchLayers });
                    if (branchFeatures.length) {
                        let popupContent = '<div style="display: flex; flex-direction: column;">';

                        branchFeatures.forEach((feature) => {
                            if (!feature || !feature.properties) return;
                            const { branch, centum_satem, family, groups } = feature.properties;

                            let groupsArray = [];
                            try {
                                if (typeof groups === 'string') {
                                    groupsArray = JSON.parse(groups);
                                } else if (Array.isArray(groups)) {
                                    groupsArray = groups;
                                }
                            } catch (e) {
                                console.error('Error parsing groups:', e);
                            }
                            const groupsString = groupsArray.join(', ');

                            let imageSrc = "/images/icons/favicon.ico";
                            if (branch === "Germanic") {
                                imageSrc = "/images/branches/germanic.png";
                            } else if (branch === "Romance") {
                                imageSrc = "/images/branches/romance.png";
                            }

                            popupContent +=
                                `<div class="popup-item-branches">
                                    <div class="image-container">
                                        <img 
                                            src="${imageSrc}" 
                                            alt="Branch Image"
                                        />
                                    </div>
                                    <div class="text-container-branches">
                                        <h1>${branch}</h1>
                                        <p><strong>Centum/Satem:</strong> ${centum_satem}</p>
                                        <p><strong>Family:</strong> ${family}</p>
                                    </div>
                                    <div class="image-container">
                                        <img 
                                            src="${imageSrc}" 
                                            alt="Branch Image"
                                        />
                                    </div>
                                    <div class="branches-container-groups">
                                        <p1><strong>Groups:</strong> ${groupsString}</p1>
                                    </div>
                                </div>`;
                        });

                        popupContent += '</div>';

                        new mapboxgl.Popup()
                            .setLngLat(e.lngLat)
                            .setHTML(popupContent)
                            .addTo(map);
                    }

                    const subdivisionFeatures = map.queryRenderedFeatures(e.point, { layers: subdivisionLayers });
                    if (subdivisionFeatures.length) {
                        let popupContent = '<div style="display: flex; flex-direction: column;">';

                        subdivisionFeatures.forEach((feature) => {
                            if (!feature || !feature.properties) return;
                            const { centum_satem, family, branches } = feature.properties;

                            let branchesArray = [];
                            try {
                                if (typeof branches === 'string') {
                                    branchesArray = JSON.parse(branches);
                                } else if (Array.isArray(branches)) {
                                    branchesArray = branches;
                                }
                            } catch (e) {
                                console.error('Error parsing branches:', e);
                            }
                            const branchesString = branchesArray.join(', ');

                            let imageSrc = "/images/icons/favicon.ico";
                            if (centum_satem === "Centum") {
                                imageSrc = "/images/subdivisions/centum.png";
                            } else if (centum_satem === "Satem") {
                                imageSrc = "/images/subdivisions/satem.png";
                            }

                            popupContent +=
                                `<div class="popup-item-subdivisions">
                                    <div class="image-container">
                                        <img 
                                            src="${imageSrc}" 
                                            alt="Subdivision Image"
                                        />
                                    </div>
                                    <div class="text-container-subdivisions">
                                        <h1>${centum_satem}</h1>
                                        <p><strong>Family:</strong> ${family}</p>
                                    </div>
                                    <div class="image-container">
                                        <img 
                                            src="${imageSrc}" 
                                            alt="Subdivision Image"
                                        />
                                    </div>
                                    <div class="subdivisions-container-branches">
                                        <p1><strong>Groups:</strong> ${branchesString}</p1>
                                    </div>
                                </div>`;
                        });

                        popupContent += '</div>';

                        new mapboxgl.Popup()
                            .setLngLat(e.lngLat)
                            .setHTML(popupContent)
                            .addTo(map);
                    }

                    const familyFeatures = map.queryRenderedFeatures(e.point, { layers: familyLayers });
                    if (familyFeatures.length) {
                        let popupContent = '<div style="display: flex; flex-direction: column;">';

                        familyFeatures.forEach((feature) => {
                            if (!feature || !feature.properties) return;
                            const { family, subdivisions } = feature.properties;
                            let subdivisionsArray = [];
                            try {
                                if (typeof subdivisions === 'string') {
                                    subdivisionsArray = JSON.parse(subdivisions);
                                } else if (Array.isArray(subdivisions)) {
                                    subdivisionsArray = subdivisions;
                                }
                            } catch (e) {
                                console.error('Error parsing subdivisions:', e);
                            }
                            const subdivisionsString = subdivisionsArray.join(', ');

                            let imageSrc = "/images/icons/favicon.ico";
                            if (family === "Indo-European") {
                                imageSrc = "/images/families/indoeuropean.png";
                            }

                            popupContent +=
                                `<div class="popup-item-families">
                                    <div class="image-container">
                                        <img 
                                            src="${imageSrc}" 
                                            alt="Family Image"
                                        />
                                    </div>
                                    <div class="text-container-families">
                                        <h1>${family}</h1>
                                    </div>
                                    <div class="image-container">
                                        <img 
                                            src="${imageSrc}" 
                                            alt="Family Image"
                                        />
                                    </div>
                                    <div class="families-container-subdivisions">
                                        <p1><strong>Subdivisions:</strong> ${subdivisionsString}</p1>
                                    </div>
                                </div>`;
                        });

                        popupContent += '</div>';

                        new mapboxgl.Popup()
                            .setLngLat(e.lngLat)
                            .setHTML(popupContent)
                            .addTo(map);
                    }
                });

                map.on('mouseenter', languageLayers, () => map.getCanvas().style.cursor = 'pointer');
                map.on('mouseleave', languageLayers, () => map.getCanvas().style.cursor = '');
                map.on('mouseenter', groupLayers, () => map.getCanvas().style.cursor = 'pointer');
                map.on('mouseleave', groupLayers, () => map.getCanvas().style.cursor = '');
                map.on('mouseenter', branchLayers, () => map.getCanvas().style.cursor = 'pointer');
                map.on('mouseleave', branchLayers, () => map.getCanvas().style.cursor = '');
                map.on('mouseenter', subdivisionLayers, () => map.getCanvas().style.cursor = 'pointer');
                map.on('mouseleave', subdivisionLayers, () => map.getCanvas().style.cursor = '');
                map.on('mouseenter', familyLayers, () => map.getCanvas().style.cursor = 'pointer');
                map.on('mouseleave', familyLayers, () => map.getCanvas().style.cursor = '');
            });

            return () => map.remove();
        } catch (error) {
            handleMapError(error);
            setWebGLSupported(false);
        }
    }, [mapContainerId,
            mapConfig,
            languageLayers,
            languagesLayerVisible,
            groupLayers,
            groupLayersVisible,
            branchLayers,
            branchLayersVisible,
            subdivisionLayers,
            subdivisionLayersVisible,
            familyLayers,
            familyLayersVisible,]
    );

    return { isWebGLSupported };
};
