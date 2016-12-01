import { PropertyBinder } from './PropertyBinder';
import { ExpressionsHelper } from '../ExpressionsHelper';
import { HtmlHelper } from '../HtmlHelper';
import { ComponentBinder } from '../ComponentBindings/ComponentBinder';

export class ViewPortBinder extends PropertyBinder {

    protected BINDING_ATTRIBUTE = 'view-port.bind';

    private componentBinder: ComponentBinder;

    elementBind(element: HTMLElement, viewModel: any, expression: string): void {

        let router = ExpressionsHelper.getEvaluatedExpression(expression, viewModel);

        router.onNavigate((componentPath: string, data?: any) => {

            this.bindCurrentRouteComponent(element, componentPath, data);

        });

        router.navigateToCurrentRoute();
    }

    bindCurrentRouteComponent(element: HTMLElement, componentPath: string, data?: any) {

        HtmlHelper.clearChildrens(element);

        if (this.componentBinder) {

            this.componentBinder.unbind();

        }

        this.componentBinder = new ComponentBinder();

        this.componentBinder.bind(componentPath, element, data).then(component => {

            let x = component;

        });

    }

}