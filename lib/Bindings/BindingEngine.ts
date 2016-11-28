import {TextBinder} from './PropertyBindings/TextBinder';
import {ValueBinder} from './PropertyBindings/ValueBinder';
import {ClickBinder} from './PropertyBindings/ClickBinder';
import {CheckedBinder} from './PropertyBindings/CheckedBinder';
import {InterpolationBinder} from './PropertyBindings/InterpolationBinder';
import {ViewPortBinder} from './PropertyBindings/ViewPortBinder';
import {VisibleBinder} from './PropertyBindings/VisibleBinder';
import {IfBinder} from './PropertyBindings/IfBinder';
import {IfNotBinder} from './PropertyBindings/IfNotBinder';
import {ForBinder} from './PropertyBindings/ForBinder';
import {HrefBinder} from './PropertyBindings/HrefBinder';
import {ClassBinder} from './PropertyBindings/ClassBinder';
import {ImportComponentBinder} from './ComponentBindings/ImportComponentBinder';
import {OnChangeBinder} from './PropertyBindings/OnChangeBinder';

import {IBinder} from './IBinder';
/**
 * Property binder engine 
 * 
 * @class PropertyBinderEngine
 */
class BindingEngine{
    
    /**
     * List of available binder
     * 
     * @readonly
     * @static
     * @type {PropertyBinder[]}
     */
    static get AvailableBinders():IBinder[]{

        return [            
            new InterpolationBinder(),
            new ForBinder(),            
            new IfBinder(),
            new IfNotBinder(),            
            new VisibleBinder(),
            new ClassBinder(),
            new TextBinder(),
            new HrefBinder(),                        
            new ValueBinder,
            new ClickBinder(),
            new OnChangeBinder(),
            new CheckedBinder(),
            new ViewPortBinder(),
            new ImportComponentBinder(),
            
            ];
    }

   
    /**
     *  Applies all the registered binders
     * 
     * @static
     * @param {*} viewModelInstance
     * @param {HTMLElement} view
     */
    static applyBinders(viewModelInstance:any,view:HTMLElement):void{  

         Array.prototype.forEach.call(BindingEngine.AvailableBinders,(binder:IBinder)=>{

            binder.bind(viewModelInstance,view);

        });        
    }
     
        
    /**
     * Registers a  binder to the available binders list
     * 
     * @static
     * @param {PropertyBinder} binder
     */
    static registerPropertyBinder(binder:IBinder){

        BindingEngine.AvailableBinders.push(binder);
        
    }

     
}

export  {        
    TextBinder,
    ValueBinder,
    ClickBinder,
    CheckedBinder,    
    InterpolationBinder,
    ImportComponentBinder,
    BindingEngine
}