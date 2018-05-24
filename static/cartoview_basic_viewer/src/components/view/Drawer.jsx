import CartoviewLayerSwitcher, {BaseMapSwitcher} from 'Source/components/view/LayerSwitcher'

import CameraIcon from '@material-ui/icons/PhotoCamera'
import CartoviewAbout from 'Source/components/view/About'
import CartoviewBookmarks from 'Source/components/view/Bookmarks'
import CartoviewLegends from 'Source/components/view/Legends'
import CollapsibleListItem from 'Source/components/view/CollapsibleItem'
import HomeIcon from '@material-ui/icons/Home'
import ImageIcon from '@material-ui/icons/Image'
import InfoIcons from '@material-ui/icons/Info'
import LayersIcons from '@material-ui/icons/Layers'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import {Loader} from 'Source/containers/CommonComponents'
import LocationIcon from '@material-ui/icons/LocationOn'
import MapIcon from '@material-ui/icons/Map'
import NavBar from 'Source/components/view/NavBar.jsx'
import Paper from '@material-ui/core/Paper'
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf'
import PrintIcon from '@material-ui/icons/Print'
import PropTypes from 'prop-types'
import React from 'react'
import SearchIcon from '@material-ui/icons/Search'
import UploadIcon from '@material-ui/icons/InsertPhoto'
import classnames from 'classnames'
import {withStyles} from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
    root: {
        height: "100%",
    },
    drawerPaper: {
        padding: theme.spacing.unit,
        height: "calc(100% - 64px)",
        overflowY: 'scroll',
    },
    button: {
        margin: theme.spacing.unit,
    },
    drawerTitle: {
        fontSize: '30px',
        // fontWeight: 'bold',
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    }
})

class CartoviewDrawer extends React.Component {
    state = {
        about: false
    }
    handleAboutChange = () => {
        const {about} = this.state
        this.setState({about: !about})
    }
    renderAppTitle(config, classes) {
        return (
            <div>
                <ListItem >
                    <ListItemText primary={config.title} className={classes.drawerTitle} disableTypography={true} />
                </ListItem>
                <Divider />
            </div>
        )
    }
    render() {
        const {
            classes, className, createLegends, urls, mapLayers, changeLayerOrder,
            handleLayerVisibilty,
            config,
            exportMap,
            handleFeaturesTableDrawer,
            map,
            setThumbnail,
            thumbnailSaving,
            baseMaps,
            handleBaseMapVisibilty,
            handlePrintModal,
            downloadLayer,
            handleTableLayerChange
        } = this.props
        const {about} = this.state
        return (
            <Paper elevation={6} className={classnames(classes.root, className)}>
                <NavBar/>
                <Paper className={classes.drawerPaper} elevation={0}>
                    <List>
                        {config.showTitle && this.renderAppTitle(config, classes)}
                        <ListItem onTouchTap={() => window.location.href = urls.appInstancesPage} button>
                            <ListItemIcon>
                                <HomeIcon/>
                            </ListItemIcon>
                            <ListItemText primary="Home"/>
                        </ListItem>
                        <ListItem onTouchTap={this.handleAboutChange} button>
                            <ListItemIcon>
                                <InfoIcons/>
                            </ListItemIcon>
                            <ListItemText primary="About"/>
                        </ListItem>
                        {config.enableFeatureTable && <ListItem onTouchTap={handleFeaturesTableDrawer} button>
                            <ListItemIcon>
                                <SearchIcon/>
                            </ListItemIcon>
                            <ListItemText primary="Query"/>
                        </ListItem>}
                        <ListItem onTouchTap={setThumbnail} button>
                            <ListItemIcon>
                                <UploadIcon/>
                            </ListItemIcon>
                            <ListItemText primary="Set Thumbnail"/>
                            {thumbnailSaving && <ListItemSecondaryAction>
                                <Loader size={20} thickness={4}/>
                            </ListItemSecondaryAction>}
                        </ListItem>
                        <CollapsibleListItem open={false} title="Print Tools" icon={<PrintIcon/>}>
                            <List>
                                <ListItem onTouchTap={handlePrintModal} button>
                                    <ListItemIcon>
                                        <PictureAsPdfIcon/>
                                    </ListItemIcon>
                                    <ListItemText primary="Print PDF"/>
                                </ListItem>
                                {config.showExportMap && <ListItem onTouchTap={exportMap} button>
                                    <ListItemIcon>
                                        <CameraIcon/>
                                    </ListItemIcon>
                                    <ListItemText primary="Export Map (PNG/JPG)"/>
                                </ListItem>}
                            </List>
                        </CollapsibleListItem>
                        {config.bookmarks && <CollapsibleListItem open={false} title="Bookmarks" icon={<LocationIcon/>}>
                            <CartoviewBookmarks map={map} bookmarks={config.bookmarks}/>
                        </CollapsibleListItem>}
                        {config.showLayerSwitcher &&
                        <CollapsibleListItem open={false} title="Layers" icon={<LayersIcons/>}>
                            <CartoviewLayerSwitcher handleFeaturesTableDrawer={handleFeaturesTableDrawer}
                                                    handleTableLayerChange={handleTableLayerChange} urls={urls}
                                                    downloadLayer={downloadLayer}
                                                    handleLayerVisibilty={handleLayerVisibilty}
                                                    changeLayerOrder={changeLayerOrder} mapLayers={mapLayers}/>
                        </CollapsibleListItem>}
                        <CollapsibleListItem open={false} title="Base Maps" icon={<MapIcon/>}>
                            <BaseMapSwitcher baseMaps={baseMaps} handleBaseMapVisibilty={handleBaseMapVisibilty}/>
                        </CollapsibleListItem>
                        {config.showLegend && <CollapsibleListItem open={false} title="Legend" icon={<ImageIcon/>}>
                            <CartoviewLegends createLegends={createLegends}/>
                        </CollapsibleListItem>}

                        <CartoviewAbout open={about} title={config.title} abstract={config.abstract}
                                        close={this.handleAboutChange}/>
                    </List>
                </Paper>
            </Paper>
        )
    }
}

CartoviewDrawer.propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string.isRequired,
    changeLayerOrder: PropTypes.func.isRequired,
    createLegends: PropTypes.func.isRequired,
    handleTableLayerChange: PropTypes.func.isRequired,
    resetTablePagination: PropTypes.func.isRequired,
    urls: PropTypes.object.isRequired,
    mapLayers: PropTypes.array.isRequired,
    baseMaps: PropTypes.array.isRequired,
    handleLayerVisibilty: PropTypes.func.isRequired,
    exportMap: PropTypes.func.isRequired,
    downloadLayer: PropTypes.func.isRequired,
    handleFeaturesTableDrawer: PropTypes.func.isRequired,
    config: PropTypes.object.isRequired,
    map: PropTypes.object.isRequired,
    setThumbnail: PropTypes.func.isRequired,
    thumbnailSaving: PropTypes.bool.isRequired,
    handleBaseMapVisibilty: PropTypes.func.isRequired,
    handlePrintModal: PropTypes.func.isRequired,
}
export default withStyles(styles)(CartoviewDrawer)