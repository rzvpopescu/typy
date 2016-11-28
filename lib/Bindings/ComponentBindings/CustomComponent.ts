import {ExpressionsHelper} from '../ExpressionsHelper';

const CUSTOM_COMPONENTS_META_PROPERTY = 'customComponent';

export function customComponent(name: string) {

    return function (target: any): void {

        markCustomComponent(target, name);

    }
}

function markCustomComponent(target: any, name: string) {

    ExpressionsHelper.setObjectMetaProperty(target, CUSTOM_COMPONENTS_META_PROPERTY, name);

}
