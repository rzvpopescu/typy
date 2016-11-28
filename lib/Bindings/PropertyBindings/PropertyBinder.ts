import {IBinder} from '../IBinder';
import {MetaHelper} from '../../MetaHelper';

const BINDERS:string = 'binders';

export abstract class PropertyBinder implements IBinder {

    protected BINDING_ATTRIBUTE: string;

    bind(viewModel: any, view: HTMLElement): Promise<boolean> {

      this.applyBindings(viewModel,view);

       let elementsWithBindigs = view.querySelectorAll(this.bindingQuerySelector);

        Array.prototype.forEach.call(elementsWithBindigs, (element: HTMLElement) => {

            this.applyBindings(viewModel,element);
            
        });

        return Promise.resolve(true);
    }

    private applyBindings(viewModel:any,element:HTMLElement):void{

        let expression = this.getBindingExpression(element);
        
        if(expression){

            this.updateBindersCollectionProperty(element);

            this.elementBind(element,viewModel,expression.trim());

        }

    }

    elementBind(element:HTMLElement,viewModel:any,expression:string):void{}

    unbind(){

        return Promise.resolve(true);

    }

    get bindingAttribute(): string {

        return this.BINDING_ATTRIBUTE;

    }

    get bindingQuerySelector(): string {

        let escapedBindingAttribute = this.bindingAttribute.replace(/\./g, '\\.');

        return `[${escapedBindingAttribute}]`;

    }

    getBindingExpression(element:HTMLElement):string{
        
        return element.getAttribute(this.bindingAttribute);

    }

    setExpressionValue(expression: string, viewModel: any, value: any) {

        if(typeof value === 'string'){

            return new Function("_", " _." + expression + '="'+value+'"')(viewModel);            

        }
        else{

            return new Function("_",'__', " _." + expression + '= __')(viewModel,value);

        }
    }


    updateBindersCollectionProperty(bindedElement:any){

        let bindersCollection = MetaHelper.getMetaProperty(bindedElement,BINDERS);

        if(!bindersCollection){

            bindersCollection =  new Map<string,PropertyBinder>();

            MetaHelper.setMetaProperty(bindedElement,BINDERS,bindersCollection);            

        }

        bindersCollection[this.BINDING_ATTRIBUTE] = this;

    }

    getBinder(bindedElement:any,bindingAttribute:string){

        let bindersCollection = MetaHelper.getMetaProperty(bindedElement,BINDERS);

        if(bindersCollection){

            return bindersCollection[bindingAttribute];

        }

        return undefined;

    }
        
}