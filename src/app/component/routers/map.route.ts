import { OutdoorComponent } from '../map/outdoor/outdoor.component';
import { ThreeMapComponent } from '../map/three-map/three-map.component';
import { ThreeDmapComponent } from '../map/three-dmap/three-dmap.component';

export const MapRoutes = [
    {
        path: 'outDoor',
        component: OutdoorComponent
    },
    {
        path: 'threeMap',
        component: ThreeMapComponent
    },
]