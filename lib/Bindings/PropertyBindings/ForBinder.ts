import {PropertyBinder} from './PropertyBinder';
import {HtmlHelper} from '../HtmlHelper';
import {ComponentBinder} from '../ComponentBindings/ComponentBinder';
import {ObserverEngine} from '../../Observer/Observer';

export class ForBinder extends PropertyBinder {

    protected BINDING_ATTRIBUTE = "for.bind";

    elementBind(element: HTMLElement, viewModel: any, expression: string): void {

        let expressionData = this.getExpressionData(expression);


        var innerElements: HTMLElement[] = Array.prototype.map.call(element.children, (child: HTMLElement) => {

            return child.cloneNode(true);

        });

        ObserverEngine.observeExpression(expressionData.expression, viewModel, (value: any, oldValue: any) => {

            this.applyBinding(viewModel, element, innerElements, value,expressionData.alias);

        });

    }

    applyBinding(viewModel:any,element: HTMLElement, innerElements: HTMLElement[], value: any,aliasName:string) {
        
        //remove elements
        HtmlHelper.clearChildrens(element);

        //add them to the current element
        let len = value.length;

        for (var i=0; i<len; i++) {

            Array.prototype.forEach.call(innerElements, (child: HTMLElement) => {

                let model = this.createScope(value[i],i,aliasName,viewModel);
                
                let childNode = child.cloneNode(true);
                                
                let binder = new ComponentBinder();

                binder.bindModel(model,childNode as HTMLElement,element);
                
            });

        }
    }

    private createScope(data:any,index:number,aliasName:string,parentInstance:any):Object{
        
        let alias:string = aliasName || "data";
        let anonData:any =  {}

        anonData[alias] = data;
        anonData['index'] = index;
        anonData['parent'] = parentInstance;

        return anonData;
    }

    private getExpressionData(expression:string):any{

        let parts = expression.split(' of ');
        
        let collectionExpression:string = undefined;
        
        let alias:string = undefined;

        if(parts.length === 1){
        
            collectionExpression = parts[0];

        }
        else if(parts.length === 2){
            
            alias = parts[0];
            
            collectionExpression = parts[1];

        }

        return {
            
            expression : collectionExpression,

            alias : alias
            
        }
    }
}