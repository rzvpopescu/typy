export default class Router {
    title: String = 'Router';
    parameters: ({ name, value })[] = [];

    load(data) {
        const keys = Object.keys(data);
        for (let key of keys) {
            this.parameters.push({
                name: key,
                value: data[key]
            });
        }
    }
}