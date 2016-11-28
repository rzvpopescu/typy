import {IfBinder} from './IfBinder';
import {ExpressionsHelper} from '../ExpressionsHelper';
import {HtmlHelper} from '../HtmlHelper';

export class IfNotBinder extends IfBinder {

    protected BINDING_ATTRIBUTE = "ifnot.bind";

     /**
     * Indicates if based on the value , the inner elements should be removed
     * 
     * @param {boolean} value
     * @returns {boolean}
     */
    shouldAddInnerElements(value:boolean):boolean{

        return !super.shouldAddInnerElements(value);
                
    }
    
}