import {EventBinder} from './EventBinder';
import {ExpressionsHelper} from '../ExpressionsHelper';

export class OnChangeBinder extends EventBinder {

    protected BINDING_ATTRIBUTE:string = 'onchange.bind';

    protected EVENT_NAME:string = 'change';
          
}