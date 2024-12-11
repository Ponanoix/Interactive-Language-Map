import React, { useState } from 'react';
import { useMapbox } from '../hooks/useMapbox';
import './LanguageMap.css';
import LanguageButton from './buttons/LanguageButton';
import GroupButton from './buttons/GroupButton';
import BranchButton from './buttons/BranchButton';

const LanguageMap = () => {
    const [languageLayerVisible, setLanguageLayerVisible] = useState(true);
    const [groupLayerVisible, setGroupLayerVisible] = useState(false);
    const [branchLayerVisible, setBranchLayerVisible] = useState(false);

    const mapContainerId = 'map';
    const mapConfig = {
        style: 'mapbox://styles/ponanoix/cm2rix1yx004u01pa4crpa141',
        center: [9.22, 46.18],
        zoom: 4.47,
    };
    const languageLayers = ['Dutch-language', 'French-language', 'Italian-language', 'German-language'];
    const groupLayers = ['West-germanic', 'Western-romance', 'South-romance'];
    const branchLayers = ['Germanic', 'Romance'];

    const { isWebGLSupported } = useMapbox(
        mapContainerId,
        mapConfig,
        languageLayers,
        languageLayerVisible,
        groupLayers,
        groupLayerVisible,
        branchLayers,
        branchLayerVisible);

    const toggleLanguageLayer = () => {
        if (!languageLayerVisible) {
            setLanguageLayerVisible((prevState) => !prevState);
            setGroupLayerVisible(false);
            setBranchLayerVisible(false);
        }
    };

    const toggleGroupLayer = () => {
        if (!groupLayerVisible) {
            setGroupLayerVisible((prevState) => !prevState);
            setLanguageLayerVisible(false);
            setBranchLayerVisible(false);
        }
    }

    const toggleBranchLayer = () => {
        if (!branchLayerVisible) {
            setBranchLayerVisible((prevState) => !prevState);
            setLanguageLayerVisible(false);
            setGroupLayerVisible(false);
        }
    }

    if (!isWebGLSupported) {
        return <div>Your browser does not support WebGL, and the map cannot be displayed.</div>;
    }

    return (
        <div id="map" className="map-container">
            <LanguageButton toggleLanguageLayer={toggleLanguageLayer} />
            <GroupButton toggleGroupLayer={toggleGroupLayer} />
            <BranchButton toggleBranchLayer={toggleBranchLayer} />
        </div>
    );
};

export default LanguageMap;
