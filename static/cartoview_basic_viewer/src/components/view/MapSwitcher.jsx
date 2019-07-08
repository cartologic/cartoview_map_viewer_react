import BasicViewerHelper from 'cartoview-sdk/helpers/BasicViewerHelper'
import FeaturesHelper from 'cartoview-sdk/helpers/FeaturesHelper'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import NativeSelect from '@material-ui/core/NativeSelect'
import Paper from '@material-ui/core/Paper'
import PropTypes from 'prop-types'
import React from 'react'
import { doGet } from 'cartoview-sdk/utils/utils'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
    formControl: {
        margin: theme.spacing.unit,
        width: 200
    },
    switcher: {
        position: 'fixed',
        zIndex: '12',
        display: 'flex',
        flexDirection: 'column',
        right: 'auto',
        top: 'auto',
        bottom: '1.8em',
        left: '1%',
    },
    switcherItem: {
        margin: theme.spacing.unit
    },
    selectEmpty: {
        marginTop: theme.spacing.unit * 2,
    },
})
class MapSwitcher extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            regions: [],
            selectedRegion: '',
            regionsLoading: true,
            communities: [],
            selectedCommunity: '',
            communitiesLoading: true
        }
    }
    switchMap = (event, community = false, desiredMap, callback = () => { }) => {
        if (!desiredMap) {
            desiredMap = this.props.map
        }
        let value = undefined
        const { regions, communities } = this.state
        if (community) {
            value = event.target.value ? communities[parseInt(event.target.value)] : null
        } else {
            value = event.target.value ? regions[parseInt(event.target.value)] : null
        }
        if (value) {
            let extent = [parseFloat(value.bbox_x0), parseFloat(value.bbox_y0), parseFloat(value.bbox_x1), parseFloat(value.bbox_y1)]
            FeaturesHelper.getCRS(value.srid.split(":").pop()).then(newCRS => {
                extent = BasicViewerHelper.reprojectExtent(extent, desiredMap, `EPSG:${newCRS}`)
                BasicViewerHelper.fitExtent(extent, desiredMap, 300)
                callback()
            })
        }
        if (community) {
            this.setState({ selectedCommunity: event.target.value })
        } else {
            this.setState({ selectedRegion: event.target.value })
        }

    }
    getRegions = () => {
        const { urls, urlsHelper } = this.props
        const targetURL = urlsHelper.getParamterizedURL(urls.regions, null)
        doGet(targetURL).then(result => {
            this.setState({ regions: result.objects, regionsLoading: false })
        })
    }
    getCommunities = () => {
        const { urls, urlsHelper } = this.props
        const targetURL = urlsHelper.getParamterizedURL(urls.communityAPI, null)
        doGet(targetURL).then(result => {
            this.setState({ communities: result.objects, communitiesLoading: false })
        })
    }
    componentDidMount() {
        this.getRegions()
        this.getCommunities()
    }
    render() {
        const { classes } = this.props
        const { regions, selectedRegion, selectedCommunity, communities } = this.state
        return (
            <div className={classes.switcher}>
                <Paper className={classes.switcherItem} >
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="region-selector">{"Counties"}</InputLabel>
                        <NativeSelect
                            value={selectedRegion}
                            onChange={this.switchMap}
                            className={classes.selectEmpty}
                            input={<Input id="region-selector" />}
                        >
                            <option value="" />
                            {regions.map(((region, index) => {
                                return <option key={index} value={index} >{region.name}</option>
                            }))}
                        </NativeSelect>
                    </FormControl>
                </Paper >
                <Paper className={classes.switcherItem}>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="region-selector">{"Communities"}</InputLabel>
                        <NativeSelect
                            value={selectedCommunity}
                            onChange={(e) => this.switchMap(e, true)}
                            className={classes.selectEmpty}
                            input={<Input id="region-selector" />}
                        >
                            <option value="" />
                            {communities.map(((community, index) => {
                                return <option key={index} value={index} >{community.name}</option>
                            }))}
                        </NativeSelect>
                    </FormControl>
                </Paper >
            </div>
        )
    }
}
MapSwitcher.propTypes = {
    classes: PropTypes.object.isRequired,
    urls: PropTypes.object.isRequired,
    urlsHelper: PropTypes.object.isRequired,
    map: PropTypes.object.isRequired,
}
export default withStyles(styles)(MapSwitcher)