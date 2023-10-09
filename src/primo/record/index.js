import Common from '../common'
import Location from '../location';
import Library from '../library';
//alma990125142070107026
//Kulayana Kwaŵukumo : kwa ŵasikulu ŵesu aŵakutupulusya Yesu Klistu.

/**
 * Helper class to access record currently in full view
 */
class CurrentRecord {
    static get record() {
        try {
            if (Common.isFullViewOverlay()) {
                return Common.components.controller('prm-full-view')[0].item;
            } else{
                return Common.components.controller('prm-full-view-page')[0].currentItem;
            }
            return null;
        } catch (e) {
            console.error(e)
            return null;
        }        

    }
    static get location() { return Location}
    static get library() {return Library}
}

export default class Record {
    /**
     * Get all records
     * 
     * @returns records
     */
    static get all() {
        try {
            if (Common.isFullView()) {
                [Common.components.controller('prm-full-view-page')[0].fullViewPageService.currentItem];
            } else {
                return Common.userSession.searchStateService.resultObject.data;
            }
        } catch (e) {
            console.error(e)
            return [];
        }
    }

    /**
     * Get current record, location and library
     */
    static get current() {
        return CurrentRecord;
    }
}
