import { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { checkWebGLSupport, handleMapError } from '../utils/mapboxUtils';

mapboxgl.accessToken = 'pk.eyJ1IjoicG9uYW5vaXgiLCJhIjoiY20yb3kwemVkMGt3MTJrczlwbjBmYmJ4ZiJ9.F7UndLXDlTla3G6cgbRhRA';

export const useMapbox = (mapContainerId,
                          mapConfig,
                          languageLayers,
                          languagesLayerVisible,
                          groupLayers,
                          groupLayersVisible,
                          branchLayers,
                          branchLayersVisible) => {
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
            });

            map.on('style.load', () => {

                map.addControl(new mapboxgl.NavigationControl(), 'top-right');

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

                toggleLanguageLayerVisibility();
                toggleGroupLayerVisibility();
                toggleBranchLayerVisibility();

                map.on('data', () => {
                    if (map.isStyleLoaded()) {
                        toggleLanguageLayerVisibility();
                        toggleGroupLayerVisibility();
                        toggleBranchLayerVisibility();
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
                });

                map.on('mouseenter', languageLayers, () => map.getCanvas().style.cursor = 'pointer');
                map.on('mouseleave', languageLayers, () => map.getCanvas().style.cursor = '');
                map.on('mouseenter', groupLayers, () => map.getCanvas().style.cursor = 'pointer');
                map.on('mouseleave', groupLayers, () => map.getCanvas().style.cursor = '');
                map.on('mouseenter', branchLayers, () => map.getCanvas().style.cursor = 'pointer');
                map.on('mouseleave', branchLayers, () => map.getCanvas().style.cursor = '');
            });

            return () => map.remove();
        } catch (error) {
            handleMapError(error);
            setWebGLSupported(false);
        }
    }, [mapContainerId, mapConfig, languageLayers, languagesLayerVisible, groupLayers, groupLayersVisible, branchLayers, branchLayersVisible]);

    return { isWebGLSupported };
};
